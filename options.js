const { STORAGE_KEY, validateCustomPatterns } = globalThis.PageNavigatorPatterns

document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.sync.get([STORAGE_KEY], function (result) {
    if (result[STORAGE_KEY]) {
      document.getElementById('customPatterns').value = result[STORAGE_KEY]
    }
  })

  document.getElementById('saveButton').addEventListener('click', saveSettings)
  document.getElementById('resetButton').addEventListener('click', resetSettings)
})

function saveSettings () {
  const customPatterns = document.getElementById('customPatterns').value.trim()

  if (customPatterns) {
    try {
      validateCustomPatterns(customPatterns)
    } catch (e) {
      showStatus('error', 'Invalid JSON or pattern format: ' + e.message)
      return
    }
  }

  chrome.storage.sync.set({
    [STORAGE_KEY]: customPatterns
  }, function () {
    if (chrome.runtime.lastError) {
      showStatus('error', 'Failed to save settings: ' + chrome.runtime.lastError.message)
    } else {
      showStatus('success', 'Settings saved successfully!')
    }
  })
}

function resetSettings () {
  document.getElementById('customPatterns').value = ''
  chrome.storage.sync.remove([STORAGE_KEY], function () {
    showStatus('success', 'Settings reset to default')
  })
}

function showStatus (type, message) {
  const status = document.getElementById('status')
  status.className = 'status ' + type
  status.textContent = message
  status.style.display = 'block'

  setTimeout(function () {
    status.style.display = 'none'
  }, 3000)
}
