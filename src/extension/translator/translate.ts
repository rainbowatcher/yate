/**
 * Translation service module
 * Uses free translation API (LibreTranslate or similar)
 */

interface TranslationResult {
  translatedText: string
}

/**
 * Translate text using free translation API
 */
export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string,
): Promise<string> {
  // Use MyMemory Translation API (free)
  // Alternative: LibreTranslate, Google Translate API (paid)
  const apiUrl = 'https://api.mymemory.translated.net/get'

  const params = new URLSearchParams({
    q: text,
    langpair: `${sourceLang === 'auto' ? '' : sourceLang}|${targetLang}`,
  })

  try {
    const response = await fetch(`${apiUrl}?${params}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!response.ok)
      throw new Error(`API request failed: ${response.status}`)

    const data = await response.json() as { responseData: TranslationResult; responseStatus: number }

    if (data.responseStatus !== 200)
      throw new Error(`Translation failed: ${data.responseData?.translatedText || 'Unknown error'}`)

    return data.responseData.translatedText
  }
  catch (error) {
    if (error instanceof Error)
      throw new Error(`Translation error: ${error.message}`)

    throw new Error('Unknown translation error')
  }
}
