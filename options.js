// Load saved settings
document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(['customPatterns'], function(result) {
    if (result.customPatterns) {
      document.getElementById('customPatterns').value = result.customPatterns;
    }
  });
});

function saveSettings() {
  const customPatterns = document.getElementById('customPatterns').value.trim();
  const status = document.getElementById('status');

  // Validate JSON if not empty
  if (customPatterns) {
    try {
      const parsed = JSON.parse(customPatterns);
      if (!Array.isArray(parsed)) {
        throw new Error('Custom patterns must be an array');
      }

      // Validate each pattern
      for (let i = 0; i < parsed.length; i++) {
        const item = parsed[i];
        if (!item.pattern || !item.replacement) {
          throw new Error(`Pattern ${i + 1} must have both 'pattern' and 'replacement' fields`);
        }

        // Test regex validity
        new RegExp(item.pattern);
      }
    } catch (e) {
      showStatus('error', 'Invalid JSON or pattern format: ' + e.message);
      return;
    }
  }

  // Save to storage
  chrome.storage.sync.set({
    customPatterns: customPatterns
  }, function() {
    if (chrome.runtime.lastError) {
      showStatus('error', 'Failed to save settings: ' + chrome.runtime.lastError.message);
    } else {
      showStatus('success', 'Settings saved successfully!');
    }
  });
}

function resetSettings() {
  document.getElementById('customPatterns').value = '';
  chrome.storage.sync.remove(['customPatterns'], function() {
    showStatus('success', 'Settings reset to default');
  });
}

function showStatus(type, message) {
  const status = document.getElementById('status');
  status.className = 'status ' + type;
  status.textContent = message;
  status.style.display = 'block';

  setTimeout(function() {
    status.style.display = 'none';
  }, 3000);
}
