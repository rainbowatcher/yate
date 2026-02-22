"use strict";
/**
 * Translation service module
 * Uses free translation API (LibreTranslate or similar)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateText = void 0;
/**
 * Translate text using free translation API
 */
async function translateText(text, sourceLang, targetLang) {
    // Use MyMemory Translation API (free)
    // Alternative: LibreTranslate, Google Translate API (paid)
    const apiUrl = 'https://api.mymemory.translated.net/get';
    const params = new URLSearchParams({
        q: text,
        langpair: `${sourceLang === 'auto' ? '' : sourceLang}|${targetLang}`,
    });
    try {
        const response = await fetch(`${apiUrl}?${params}`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        });
        if (!response.ok)
            throw new Error(`API request failed: ${response.status}`);
        const data = await response.json();
        if (data.responseStatus !== 200)
            throw new Error(`Translation failed: ${data.responseData?.translatedText || 'Unknown error'}`);
        return data.responseData.translatedText;
    }
    catch (error) {
        if (error instanceof Error)
            throw new Error(`Translation error: ${error.message}`);
        throw new Error('Unknown translation error');
    }
}
exports.translateText = translateText;
//# sourceMappingURL=translate.js.map