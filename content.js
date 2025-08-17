// Get configuration or use defaults
let pagePatterns = [
  { pattern: /\/pages?\/(\d+)/, replacement: '/page/$1' },
  { pattern: /[?&]pages?=(\d+)/, replacement: '?page=$1' },
  { pattern: /[?&]p=(\d+)/, replacement: '?p=$1' }
]

// Load custom patterns from storage via background script
chrome.runtime.sendMessage({ action: 'getCustomPatterns' }, (response) => {
  if (response && response.customPatterns) {
    try {
      const custom = JSON.parse(response.customPatterns)
      pagePatterns = [...pagePatterns, ...custom]
    } catch (e) {
      console.warn('Invalid custom patterns in storage')
    }
  }
})

function detectPageNumber (url) {
  for (const config of pagePatterns) {
    const match = url.match(config.pattern)
    if (match) {
      return {
        currentPage: parseInt(match[1]),
        pattern: config.pattern,
        replacement: config.replacement
      }
    }
  }
  return null
}

function generateNewUrl (currentUrl, pageInfo, direction) {
  const newPage = pageInfo.currentPage + direction
  if (newPage < 1) return null

  // Handle path-based patterns like /page/2
  if (pageInfo.replacement.includes('/')) {
    return currentUrl.replace(pageInfo.pattern, pageInfo.replacement.replace('$1', newPage))
  }

  // Handle query parameter patterns
  const url = new URL(currentUrl)
  const paramName = pageInfo.replacement.split('=')[0].replace('?', '')
  url.searchParams.set(paramName, newPage)
  return url.toString()
}

function navigateToPage (direction) {
  const currentUrl = window.location.href
  const pageInfo = detectPageNumber(currentUrl)

  if (!pageInfo) return

  const newUrl = generateNewUrl(currentUrl, pageInfo, direction)
  if (newUrl) {
    window.location.href = newUrl
  }
}

// Handle keyboard events
document.addEventListener('keydown', function (event) {
  // Only trigger on arrow keys and when no input elements are focused
  if (document.activeElement.tagName === 'INPUT' ||
      document.activeElement.tagName === 'TEXTAREA' ||
      document.activeElement.isContentEditable) {
    return
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    navigateToPage(-1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    navigateToPage(1)
  }
})
