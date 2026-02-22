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
exports.translateComments = void 0;
const vscode = __importStar(require("vscode"));
const translate_1 = require("./translate");
const commentPatterns = {
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
};
/**
 * Translate all comments in the active editor
 */
async function translateComments(editor, languageId, sourceLang, targetLang) {
    const document = editor.document;
    const text = document.getText();
    const patterns = commentPatterns[languageId];
    if (!patterns)
        throw new Error(`Unsupported language: ${languageId}`);
    const edits = [];
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Check for line comments
        const lineMatch = line.match(patterns.line);
        if (lineMatch && lineMatch[1]) {
            const commentText = lineMatch[1].trim();
            if (commentText && !isTranslationComment(commentText)) {
                try {
                    const translated = await (0, translate_1.translateText)(commentText, sourceLang, targetLang);
                    const startPos = new vscode.Position(i, line.includes('//') ? line.indexOf('//') : line.indexOf('#'));
                    const endPos = new vscode.Position(i, line.length);
                    edits.push(new vscode.TextEdit(new vscode.Range(startPos, endPos), line.replace(lineMatch[1], ` ${translated}`)));
                }
                catch (error) {
                    console.error(`Failed to translate line ${i + 1}:`, error);
                }
            }
        }
    }
    if (edits.length > 0) {
        const workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.set(document.uri, edits);
        await vscode.workspace.applyEdit(workspaceEdit);
    }
}
exports.translateComments = translateComments;
/**
 * Check if the comment is already a translation marker
 */
function isTranslationComment(text) {
    return text.startsWith('[Translated]') || text.startsWith('[翻译]');
}
//# sourceMappingURL=comments.js.map