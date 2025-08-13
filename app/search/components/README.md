# Google Maps Integration

## Setup Instructions

To enable the interactive Google Maps functionality:

1. **Get a Google Maps API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Maps JavaScript API
     - Places API
     - Geocoding API
   - Create credentials (API Key)
   - Restrict the API key to your domain for security

2. **Add the API Key to your environment:**
   \`\`\`bash
   # Add to your .env.local file
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   \`\`\`

3. **Features Available:**
   - Interactive map with hospital markers
   - Marker clustering for dense areas
   - Info windows with hospital details
   - Synchronized map and list interactions
   - User location detection
   - Fallback MockMap when no API key is provided

## Fallback Behavior

If no Google Maps API key is provided, the component will automatically display a MockMap with:
- List of nearby hospitals
- Basic hospital information
- Click-to-select functionality
- No external dependencies required

This ensures the application works perfectly even without Google Maps integration.
