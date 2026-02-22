import * as vscode from 'vscode'
import { translateText } from './translate'

/**
 * Comment patterns for different programming languages
 */
interface CommentPattern {
  line: RegExp
  blockStart: RegExp
  blockEnd: RegExp
}

const commentPatterns: Record<string, CommentPattern> = {
  javascript: {
    line: /\/\/(.*)$/gm,
    blockStart: /\/\*(.*)/g,
    blockEnd: /\*\/(.*)/g,
  },
  typescript: {
    line: /\/\/(.*)$/gm,
    blockStart: /\/\*(.*)/g,
    blockEnd: /\*\/(.*)/g,
  },
  python: {
    line: /#(.*)$/gm,
    blockStart: /"""(.*)/g,
    blockEnd: /"""(.*)/g,
  },
  java: {
    line: /\/\/(.*)$/gm,
    blockStart: /\/\*(.*)/g,
    blockEnd: /\*\/(.*)/g,
  },
  cpp: {
    line: /\/\/(.*)$/gm,
    blockStart: /\/\*(.*)/g,
    blockEnd: /\*\/(.*)/g,
  },
  c: {
    line: /\/\/(.*)$/gm,
    blockStart: /\/\*(.*)/g,
    blockEnd: /\*\/(.*)/g,
  },
  go: {
    line: /\/\/(.*)$/gm,
    blockStart: /\/\*(.*)/g,
    blockEnd: /\*\/(.*)/g,
  },
  rust: {
    line: /\/\/(.*)$/gm,
    blockStart: /\/\*(.*)/g,
    blockEnd: /\*\/(.*)/g,
  },
  ruby: {
    line: /#(.*)$/gm,
    blockStart: /=begin(.*)/g,
    blockEnd: /=end(.*)/g,
  },
  php: {
    line: /\/\/(.*)$/gm,
    blockStart: /\/\*(.*)/g,
    blockEnd: /\*\/(.*)/g,
  },
  swift: {
    line: /\/\/(.*)$/gm,
    blockStart: /\/\*(.*)/g,
    blockEnd: /\*\/(.*)/g,
  },
  kotlin: {
    line: /\/\/(.*)$/gm,
    blockStart: /\/\*(.*)/g,
    blockEnd: /\*\/(.*)/g,
  },
  scala: {
    line: /\/\/(.*)$/gm,
    blockStart: /\/\*(.*)/g,
    blockEnd: /\*\/(.*)/g,
  },
}

/**
 * Translate all comments in the active editor
 */
export async function translateComments(
  editor: vscode.TextEditor,
  languageId: string,
  sourceLang: string,
  targetLang: string,
): Promise<void> {
  const document = editor.document
  const text = document.getText()
  const patterns = commentPatterns[languageId]

  if (!patterns)
    throw new Error(`Unsupported language: ${languageId}`)

  const edits: vscode.TextEdit[] = []
  const lines = text.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Check for line comments
    const lineMatch = line.match(patterns.line)
    if (lineMatch && lineMatch[1]) {
      const commentText = lineMatch[1].trim()
      if (commentText && !isTranslationComment(commentText)) {
        try {
          const translated = await translateText(commentText, sourceLang, targetLang)
          const startPos = new vscode.Position(i, line.includes('//') ? line.indexOf('//') : line.indexOf('#'))
          const endPos = new vscode.Position(i, line.length)

          edits.push(new vscode.TextEdit(
            new vscode.Range(startPos, endPos),
            line.replace(lineMatch[1], ` ${translated}`),
          ))
        }
        catch (error) {
          console.error(`Failed to translate line ${i + 1}:`, error)
        }
      }
    }
  }

  if (edits.length > 0) {
    const workspaceEdit = new vscode.WorkspaceEdit()
    workspaceEdit.set(document.uri, edits)
    await vscode.workspace.applyEdit(workspaceEdit)
  }
}

/**
 * Check if the comment is already a translation marker
 */
function isTranslationComment(text: string): boolean {
  return text.startsWith('[Translated]') || text.startsWith('[翻译]')
}
