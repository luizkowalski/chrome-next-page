const { DEFAULT_PATTERNS, loadPatterns } = globalThis.PageNavigatorPatterns

let pagePatterns = [...DEFAULT_PATTERNS]
loadPatterns((patterns) => {
  pagePatterns = patterns
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

  if (pageInfo.replacement.includes('/')) {
    return currentUrl.replace(pageInfo.pattern, pageInfo.replacement.replace('$1', newPage))
  }

  const url = new URL(currentUrl)
  const paramName = pageInfo.replacement.split('=')[0].replace('?', '')
  url.searchParams.set(paramName, newPage)
  return url.toString()
}

function pageNumberFor (el) {
  const href = el.getAttribute('href')
  if (href) {
    try {
      const info = detectPageNumber(new URL(href, window.location.href).href)
      if (info) return info.currentPage
    } catch {}
  }

  const label = el.getAttribute('aria-label') || ''
  const match = label.match(/\bpage\s+(\d+)\b/i)
  if (match) return parseInt(match[1])

  return null
}

function isUsable (el) {
  return el && !el.disabled && el.getAttribute('aria-disabled') !== 'true'
}

function opensNewTab (el) {
  return el.tagName === 'A' && (el.target === '_blank' || el.hasAttribute('download'))
}

function findExactPageControl (targetPage) {
  const candidates = document.querySelectorAll('a[href], button, [role="button"]')
  for (const el of candidates) {
    if (isUsable(el) && pageNumberFor(el) === targetPage) return el
  }
  return null
}

function findRelativeControl (direction) {
  const selectors = direction > 0
    ? [
        'a[rel~="next"]',
        '.artdeco-pagination__button--next',
        '[aria-label="Next" i]',
        '[aria-label="Next page" i]',
        '[aria-label="Go to next page" i]'
      ]
    : [
        'a[rel~="prev"]',
        'a[rel~="previous"]',
        '.artdeco-pagination__button--previous',
        '[aria-label="Previous" i]',
        '[aria-label="Previous page" i]',
        '[aria-label="Go to previous page" i]'
      ]

  for (const selector of selectors) {
    const el = document.querySelector(selector)
    if (isUsable(el)) return el
  }
  return null
}

function navigateToPage (direction) {
  const pageInfo = detectPageNumber(window.location.href)
  if (!pageInfo) return false

  const targetPage = pageInfo.currentPage + direction
  if (targetPage < 1) return false

  const control = findExactPageControl(targetPage) || findRelativeControl(direction)
  if (control && !opensNewTab(control)) {
    control.click()
    return true
  }

  const newUrl = generateNewUrl(window.location.href, pageInfo, direction)
  if (!newUrl) return false

  window.location.href = newUrl
  return true
}

document.addEventListener('keydown', function (event) {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

  const active = document.activeElement
  if (active && (active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.isContentEditable)) {
    return
  }

  if (navigateToPage(event.key === 'ArrowRight' ? 1 : -1)) {
    event.preventDefault()
  }
})
