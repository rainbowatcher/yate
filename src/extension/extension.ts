import * as vscode from 'vscode';
import { translateText } from './translator/translate';
import { translateComments } from './translator/comments';
import { translateMarkdown } from './translator/markdown';

export function activate(context: vscode.ExtensionContext) {
    // Register translate selection command
    const translateCommand = vscode.commands.registerCommand(
        'code-translator.translate',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage('No active editor');
                return;
            }

            const selection = editor.selection;
            const text = editor.document.getText(selection);

            if (!text) {
                vscode.window.showInformationMessage('No text selected');
                return;
            }

            const targetLanguage = vscode.workspace.getConfiguration('code-translator')
                .get<string>('targetLanguage') || 'en';
            const sourceLanguage = vscode.workspace.getConfiguration('code-translator')
                .get<string>('sourceLanguage') || 'auto';

            try {
                const translated = await translateText(text, sourceLanguage, targetLanguage);
                await editor.edit(editBuilder => {
                    editBuilder.replace(selection, translated);
                });
                vscode.window.showInformationMessage(`Translated to ${targetLanguage}`);
            } catch (error) {
                vscode.window.showErrorMessage(`Translation failed: ${error}`);
            }
        }
    );

    // Register translate all comments command
    const translateCommentsCommand = vscode.commands.registerCommand(
        'code-translator.translateComments',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage('No active editor');
                return;
            }

            const document = editor.document;
            const languageId = document.languageId;

            const targetLanguage = vscode.workspace.getConfiguration('code-translator')
                .get<string>('targetLanguage') || 'en';
            const sourceLanguage = vscode.workspace.getConfiguration('code-translator')
                .get<string>('sourceLanguage') || 'auto';

            try {
                await translateComments(editor, languageId, sourceLanguage, targetLanguage);
                vscode.window.showInformationMessage(`All comments translated to ${targetLanguage}`);
            } catch (error) {
                vscode.window.showErrorMessage(`Translation failed: ${error}`);
            }
        }
    );

    // Register translate markdown command
    const translateMarkdownCommand = vscode.commands.registerCommand(
        'code-translator.translateMarkdown',
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showInformationMessage('No active editor');
                return;
            }

            const document = editor.document;
            if (document.languageId !== 'markdown') {
                vscode.window.showInformationMessage('Please open a Markdown file');
                return;
            }

            const targetLanguage = vscode.workspace.getConfiguration('code-translator')
                .get<string>('targetLanguage') || 'en';
            const sourceLanguage = vscode.workspace.getConfiguration('code-translator')
                .get<string>('sourceLanguage') || 'auto';

            try {
                await translateMarkdown(editor, sourceLanguage, targetLanguage);
                vscode.window.showInformationMessage(`Markdown translated to ${targetLanguage}`);
            } catch (error) {
                vscode.window.showErrorMessage(`Translation failed: ${error}`);
            }
        }
    );

    context.subscriptions.push(translateCommand);
    context.subscriptions.push(translateCommentsCommand);
    context.subscriptions.push(translateMarkdownCommand);
}

export function deactivate() {}
