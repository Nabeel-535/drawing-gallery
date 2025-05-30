# Google Analytics Implementation

This document explains how Google Analytics (GA4) is implemented in the Drawing Gallery website.

## Setup

1. The implementation uses Google Analytics 4 (GA4) with gtag.js
2. Configuration is done through environment variables
3. Page views are automatically tracked on route changes
4. Custom events can be tracked using the provided utility functions

## Configuration

1. Create a `.env.local` file in the root of your project (or use the existing one)
2. Add your Google Analytics Measurement ID:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
3. Replace `G-XXXXXXXXXX` with your actual GA4 Measurement ID

## Usage

### Page Views

Page views are automatically tracked whenever the route changes. This is handled by the `useGoogleAnalytics` hook which is implemented in the `GoogleAnalytics` component that's included in the root layout.

### Custom Events

To track custom events, import the `event` function from the gtag utility:

```javascript
import { event } from '@/lib/gtag';

// Track a button click
function handleButtonClick() {
  event({
    action: 'click',
    category: 'engagement',
    label: 'download_button',
    value: 1
  });
  
  // Rest of your click handler code
}
```

### Event Parameters

- `action`: Required. The type of event (e.g., 'click', 'download', 'submit')
- `category`: Optional. The category of the event (e.g., 'engagement', 'ecommerce')
- `label`: Optional. Additional information about the event (e.g., 'homepage_banner', 'product_id_123')
- `value`: Optional. A numeric value associated with the event

## Implementation Details

The Google Analytics implementation consists of:

1. **Script Tags**: Added to the document head in `layout.jsx`
2. **Utility Functions**: Located in `src/lib/gtag.js`
3. **Custom Hook**: `useGoogleAnalytics` in `src/hooks/useGoogleAnalytics.js`
4. **Component**: `GoogleAnalytics` in `src/components/common/GoogleAnalytics.jsx`

## Debugging

To verify that Google Analytics is working correctly:

1. Install the [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension
2. Open your website and check the browser console for GA debug messages
3. In Google Analytics, go to Reports > Realtime to see current active users