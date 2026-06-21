globalThis.PageNavigatorPatterns = (function () {
  const STORAGE_KEY = 'customPatterns'

  const DEFAULT_PATTERNS = [
    { pattern: /\/pages?\/(\d+)/, replacement: '/page/$1' },
    { pattern: /[?&]pages?=(\d+)/, replacement: '?page=$1' },
    { pattern: /[?&]p=(\d+)/, replacement: '?p=$1' }
  ]

  function validateCustomPatterns (jsonString) {
    const parsed = JSON.parse(jsonString)
    if (!Array.isArray(parsed)) {
      throw new Error('Custom patterns must be an array')
    }
    parsed.forEach((item, index) => {
      if (!item.pattern || !item.replacement) {
        throw new Error(`Pattern ${index + 1} must have both 'pattern' and 'replacement' fields`)
      }
      RegExp(item.pattern)
    })
    return parsed
  }

  function normalizePatterns (entries) {
    return entries.map((item) => ({
      pattern: item.pattern instanceof RegExp ? item.pattern : new RegExp(item.pattern),
      replacement: item.replacement
    }))
  }

  function loadPatterns (callback) {
    chrome.storage.sync.get([STORAGE_KEY], (result) => {
      let patterns = [...DEFAULT_PATTERNS]
      const stored = result[STORAGE_KEY]
      if (stored) {
        try {
          patterns = [...patterns, ...normalizePatterns(validateCustomPatterns(stored))]
        } catch (e) {
          console.warn('Invalid custom patterns in storage')
        }
      }
      callback(patterns)
    })
  }

  return { STORAGE_KEY, DEFAULT_PATTERNS, validateCustomPatterns, normalizePatterns, loadPatterns }
})()
