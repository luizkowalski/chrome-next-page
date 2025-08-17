# Page Navigator Chrome Extension

A simple Chrome extension that allows you to navigate between pages using left and right arrow keys.

## Features

- **Arrow Key Navigation**: Use ← and → keys to move between pages
- **Smart URL Detection**: Automatically detects common pagination patterns:
  - `/page/2` or `/pages/2`
  - `?page=2` or `?pages=2` 
  - `?p=2`
- **Custom Patterns**: Add your own URL patterns via the options page
- **Input Field Safety**: Only works when not typing in input fields

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension is now installed!

## Usage

1. Visit any website with pagination (e.g., search results, forums, blogs)
2. Use the **left arrow key** (←) to go to the previous page
3. Use the **right arrow key** (→) to go to the next page
4. The extension automatically detects if the current URL has page numbers

## Configuration

Right-click the extension icon and select "Options" to:
- View built-in patterns
- Add custom URL patterns for specific websites
- See usage examples

### Adding Custom Patterns

Custom patterns use JSON format with regex patterns:

```json
[
  {
    "pattern": "/offset/(\\d+)",
    "replacement": "/offset/$1"
  },
  {
    "pattern": "[?&]start=(\\d+)",
    "replacement": "?start=$1"
  }
]
```

## Supported URL Patterns

The extension works with URLs containing:
- Path-based pagination: `/page/2`, `/pages/5`
- Query parameter pagination: `?page=3`, `?p=1`
- Custom patterns you configure

## Files

- `manifest.json` - Extension configuration
- `content.js` - Main functionality for detecting URLs and handling keys
- `options.html` - Settings page interface
- `options.js` - Settings page functionality