import * as vscode from 'vscode'
import { translateText } from './translator/translate'
import { translateComments } from './translator/comments'
import { translateMarkdown } from './translator/markdown'

// Store the translation panel
let translationPanel: vscode.WebviewPanel | undefined

// Language name mapping
const languageNames: Record<string, string> = {
  'en': 'English',
  'zh-CN': 'Chinese (Simplified)',
  'zh-TW': 'Chinese (Traditional)',
  'ja': 'Japanese',
  'ko': 'Korean',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'ru': 'Russian',
  'pt': 'Portuguese',
  'it': 'Italian',
}

export function activate(context: vscode.ExtensionContext) {
  // Register translate selection command - shows translation in side panel
  const translateCommand = vscode.commands.registerCommand(
    'yate.translate',
    async () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) {
        vscode.window.showInformationMessage('No active editor')
        return
      }

      const selection = editor.selection
      const text = editor.document.getText(selection)

      if (!text) {
        vscode.window.showInformationMessage('No text selected')
        return
      }

      await performTranslation(text, 'Selection')
    },
  )

  // Register translate entire file command
  const translateFileCommand = vscode.commands.registerCommand(
    'yate.translateFile',
    async () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) {
        vscode.window.showInformationMessage('No active editor')
        return
      }

      const document = editor.document
      const text = document.getText()

      await performTranslation(text, 'File')
    },
  )

  // Register translate comments in file command
  const translateCommentsCommand = vscode.commands.registerCommand(
    'yate.translateComments',
    async () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) {
        vscode.window.showInformationMessage('No active editor')
        return
      }

      const languageId = editor.document.languageId
      const targetLanguage = vscode.workspace
        .getConfiguration('yate')
        .get<string>('targetLanguage') || 'en'
      const sourceLanguage = vscode.workspace
        .getConfiguration('yate')
        .get<string>('sourceLanguage') || 'auto'

      vscode.window.showInformationMessage('Translating comments...')

      try {
        await translateComments(editor, languageId, sourceLanguage, targetLanguage)
        vscode.window.showInformationMessage('Comments translated successfully')
      }
      catch (error) {
        vscode.window.showErrorMessage(`Failed to translate comments: ${error}`)
      }
    },
  )

  // Register translate markdown command
  const translateMarkdownCommand = vscode.commands.registerCommand(
    'yate.translateMarkdown',
    async () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) {
        vscode.window.showInformationMessage('No active editor')
        return
      }

      if (!editor.document.uri.path.endsWith('.md')) {
        vscode.window.showWarningMessage('Please open a Markdown file')
        return
      }

      const targetLanguage = vscode.workspace
        .getConfiguration('yate')
        .get<string>('targetLanguage') || 'en'
      const sourceLanguage = vscode.workspace
        .getConfiguration('yate')
        .get<string>('sourceLanguage') || 'auto'

      vscode.window.showInformationMessage('Translating markdown...')

      try {
        await translateMarkdown(editor, sourceLanguage, targetLanguage)
        vscode.window.showInformationMessage('Markdown translated successfully')
      }
      catch (error) {
        vscode.window.showErrorMessage(`Failed to translate markdown: ${error}`)
      }
    },
  )

  context.subscriptions.push(translateCommand)
  context.subscriptions.push(translateFileCommand)
  context.subscriptions.push(translateCommentsCommand)
  context.subscriptions.push(translateMarkdownCommand)
}

async function performTranslation(text: string, mode: string) {
  const targetLanguage = vscode.workspace
    .getConfiguration('yate')
    .get<string>('targetLanguage') || 'en'
  const sourceLanguage = vscode.workspace
    .getConfiguration('yate')
    .get<string>('sourceLanguage') || 'auto'

  // Show loading message
  vscode.window.showInformationMessage('Translating...')

  try {
    const translated = await translateText(text, sourceLanguage, targetLanguage)
    const targetLangName = languageNames[targetLanguage] || targetLanguage

    // Create or show the side panel
    if (!translationPanel) {
      translationPanel = vscode.window.createWebviewPanel(
        'yateTranslator',
        `Translation (${targetLangName})`,
        {
          viewColumn: vscode.ViewColumn.Two,
          preserveFocus: true,
        },
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        },
      )

      // Handle panel close
      translationPanel.onDidDispose(() => {
        translationPanel = undefined
      })
    }
    else {
      // Update panel title
      translationPanel.title = `Translation (${targetLangName})`
      // Show the panel
      ;(translationPanel as vscode.WebviewPanel).reveal()
    }

    // Generate HTML content
    const html = generateHtml(translated, targetLanguage)
    translationPanel.webview.html = html

    vscode.window.showInformationMessage(
      `Translation complete: ${mode} → ${targetLangName}`,
    )
  }
  catch (error) {
    vscode.window.showErrorMessage(`Translation failed: ${error}`)
  }
}

function generateHtml(translated: string, targetLanguage: string): string {
  // Escape HTML
  const escapedContent = translated
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')

  // Basic markdown-like rendering
  const contentHtml = escapedContent
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    // Lists
    .replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>')
    .replace(/^\s*\d+\.\s+(.*)$/gm, '<li>$1</li>')
    // Line breaks
    .replace(/\n/g, '<br>')

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      padding: 16px;
      line-height: 1.6;
      color: var(--vscode-editor-foreground, #cccccc);
      background-color: var(--vscode-editor-background, #1e1e1e);
    }
    h1, h2, h3 {
      color: var(--vscode-editorHeader-foreground, #ffffff);
      border-bottom: 1px solid var(--vscode-editorLineHighlightBorder, #333);
      padding-bottom: 8px;
    }
    pre, code {
      background-color: var(--vscode-editorInlayHint-background, #2d2d2d);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Fira Code', Consolas, monospace;
    }
    pre {
      padding: 12px;
      overflow-x: auto;
    }
    li {
      margin-left: 20px;
    }
    a {
      color: var(--vscode-textLink-foreground, #4fc3f7);
    }
    .copy-btn {
      position: fixed;
      top: 16px;
      right: 16px;
      background-color: var(--vscode-button-background, #0e639c);
      color: var(--vscode-button-foreground, #ffffff);
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    .copy-btn:hover {
      background-color: var(--vscode-button-hoverBackground, #1177bb);
    }
    .translation-content {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  </style>
</head>
<body>
  <button class="copy-btn" onclick="copyTranslation()">Copy Translation</button>
  <div class="translation-content">${contentHtml}</div>
  <script>
    function copyTranslation() {
      const text = document.querySelector('.translation-content').innerText;
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.textContent = 'Copied!';
        setTimeout(() => {
          btn.textContent = 'Copy Translation';
        }, 2000);
      });
    }
  </script>
</body>
</html>`
}

export function deactivate() {}
