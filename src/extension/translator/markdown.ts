import * as vscode from 'vscode'
import { translateText } from './translate'

/**
 * Translate markdown file content
 */
export async function translateMarkdown(
  editor: vscode.TextEditor,
  sourceLang: string,
  targetLang: string,
): Promise<void> {
  const document = editor.document
  const text = document.getText()
  const lines = text.split('\n')

  const edits: vscode.TextEdit[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Skip code blocks
    if (line.trim().startsWith('```') || line.trim().startsWith('~~~'))
      continue

    // Skip HTML comments
    if (line.trim().startsWith('<!--') || line.trim().startsWith('-->'))
      continue

    // Skip frontmatter
    if (line.trim() === '---' && i === 0) {
      // Find the closing ---
      let j = i + 1
      while (j < lines.length && lines[j].trim() !== '---')
        j++

      i = j
      continue
    }

    // Skip blank lines
    if (!line.trim())
      continue

    // Check for headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const content = headingMatch[2].trim()
      if (content && !isTranslationMarker(content)) {
        try {
          const translated = await translateText(content, sourceLang, targetLang)
          edits.push(new vscode.TextEdit(
            new vscode.Range(new vscode.Position(i, 0), new vscode.Position(i, line.length)),
                        `${headingMatch[1]} ${translated}`,
          ))
        }
        catch (error) {
          console.error(`Failed to translate heading line ${i + 1}:`, error)
        }
      }
      continue
    }

    // Check for list items
    const listMatch = line.match(/^(\s*[-*+]\s+|\s*\d+\.\s+)(.+)$/)
    if (listMatch) {
      const content = listMatch[2].trim()
      if (content && !isTranslationMarker(content) && !isCodeBlockLine(content)) {
        try {
          const translated = await translateText(content, sourceLang, targetLang)
          edits.push(new vscode.TextEdit(
            new vscode.Range(new vscode.Position(i, 0), new vscode.Position(i, line.length)),
                        `${listMatch[1]}${translated}`,
          ))
        }
        catch (error) {
          console.error(`Failed to translate list item line ${i + 1}:`, error)
        }
      }
      continue
    }

    // Check for blockquotes
    const blockquoteMatch = line.match(/^>\s+(.+)$/)
    if (blockquoteMatch) {
      const content = blockquoteMatch[1].trim()
      if (content && !isTranslationMarker(content)) {
        try {
          const translated = await translateText(content, sourceLang, targetLang)
          edits.push(new vscode.TextEdit(
            new vscode.Range(new vscode.Position(i, 0), new vscode.Position(i, line.length)),
                        `> ${translated}`,
          ))
        }
        catch (error) {
          console.error(`Failed to translate blockquote line ${i + 1}:`, error)
        }
      }
      continue
    }

    // Check for table rows
    if (line.includes('|') && !line.trim().startsWith('|---')) {
      const cells = line.split('|').filter(cell => cell.trim())
      const translatedCells: string[] = []

      for (const cell of cells) {
        const content = cell.trim()
        if (content && !isTranslationMarker(content) && !isCodeBlockLine(content)) {
          try {
            const translated = await translateText(content, sourceLang, targetLang)
            translatedCells.push(translated)
          }
          catch {
            translatedCells.push(content)
          }
        }
        else {
          translatedCells.push(content)
        }
      }

      if (translatedCells.length > 0) {
        edits.push(new vscode.TextEdit(
          new vscode.Range(new vscode.Position(i, 0), new vscode.Position(i, line.length)),
          `| ${translatedCells.join(' | ')} |`,
        ))
      }
      continue
    }

    // Regular paragraph
    if (!line.startsWith('#') && !line.startsWith('-') && !line.startsWith('*') && !line.startsWith('+')) {
      const content = line.trim()
      if (content && !isTranslationMarker(content) && !isCodeBlockLine(content)) {
        try {
          const translated = await translateText(content, sourceLang, targetLang)
          edits.push(new vscode.TextEdit(
            new vscode.Range(new vscode.Position(i, 0), new vscode.Position(i, line.length)),
            translated,
          ))
        }
        catch (error) {
          console.error(`Failed to translate paragraph line ${i + 1}:`, error)
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
 * Check if the text is already marked as translated
 */
function isTranslationMarker(text: string): boolean {
  return text.startsWith('[Translated]') || text.startsWith('[翻译]')
}

/**
 * Check if the line contains code
 */
function isCodeBlockLine(text: string): boolean {
  return text.startsWith('`') || text.includes('function')
           || text.includes('const ') || text.includes('let ')
           || text.includes('var ') || text.includes('class ')
           || text.includes('import ') || text.includes('export ')
}
