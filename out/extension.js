"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const translate_1 = require("./translator/translate");
const comments_1 = require("./translator/comments");
const markdown_1 = require("./translator/markdown");
function activate(context) {
    // Register translate selection command
    const translateCommand = vscode.commands.registerCommand('code-translator.translate', async () => {
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
            .get('targetLanguage') || 'en';
        const sourceLanguage = vscode.workspace.getConfiguration('code-translator')
            .get('sourceLanguage') || 'auto';
        try {
            const translated = await (0, translate_1.translateText)(text, sourceLanguage, targetLanguage);
            await editor.edit(editBuilder => {
                editBuilder.replace(selection, translated);
            });
            vscode.window.showInformationMessage(`Translated to ${targetLanguage}`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Translation failed: ${error}`);
        }
    });
    // Register translate all comments command
    const translateCommentsCommand = vscode.commands.registerCommand('code-translator.translateComments', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showInformationMessage('No active editor');
            return;
        }
        const document = editor.document;
        const languageId = document.languageId;
        const targetLanguage = vscode.workspace.getConfiguration('code-translator')
            .get('targetLanguage') || 'en';
        const sourceLanguage = vscode.workspace.getConfiguration('code-translator')
            .get('sourceLanguage') || 'auto';
        try {
            await (0, comments_1.translateComments)(editor, languageId, sourceLanguage, targetLanguage);
            vscode.window.showInformationMessage(`All comments translated to ${targetLanguage}`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Translation failed: ${error}`);
        }
    });
    // Register translate markdown command
    const translateMarkdownCommand = vscode.commands.registerCommand('code-translator.translateMarkdown', async () => {
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
            .get('targetLanguage') || 'en';
        const sourceLanguage = vscode.workspace.getConfiguration('code-translator')
            .get('sourceLanguage') || 'auto';
        try {
            await (0, markdown_1.translateMarkdown)(editor, sourceLanguage, targetLanguage);
            vscode.window.showInformationMessage(`Markdown translated to ${targetLanguage}`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Translation failed: ${error}`);
        }
    });
    context.subscriptions.push(translateCommand);
    context.subscriptions.push(translateCommentsCommand);
    context.subscriptions.push(translateMarkdownCommand);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map