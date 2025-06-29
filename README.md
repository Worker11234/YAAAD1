# MemoryMesh - Family Memory Preservation App

A collaborative platform for families to preserve, organize, and share precious memories. Built with React, TypeScript, and Capacitor for native mobile app deployment.

## Features

- 📸 **Memory Capture**: Upload photos, videos, and audio recordings
- 👨‍👩‍👧‍👦 **Family Collaboration**: Invite family members to contribute
- 🏷️ **Smart Organization**: AI-powered tagging and categorization
- 🎮 **Memory Games**: Cognitive wellness activities
- 🔍 **Advanced Search**: Find memories quickly
- 🔒 **Privacy Controls**: Secure family data
- 📱 **Native Mobile App**: Available for Android and iOS

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Mobile**: Capacitor for native iOS/Android apps
- **Icons**: Lucide React
- **Routing**: React Router
- **Build Tool**: Vite

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd memorymesh
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Mobile App Development

### Android Setup

1. **Add Android platform:**
   ```bash
   npm run cap:add:android
   ```

2. **Build and sync:**
   ```bash
   npm run android:build
   ```

3. **Open in Android Studio:**
   ```bash
   npm run android:open
   ```

4. **Run on device/emulator:**
   ```bash
   npm run android:dev
   ```

### iOS Setup

1. **Add iOS platform:**
   ```bash
   npm run cap:add:ios
   ```

2. **Build and sync:**
   ```bash
   npm run ios:build
   ```

3. **Open in Xcode:**
   ```bash
   npm run ios:open
   ```

## Building for Production

### Web App
```bash
npm run build
```

### Android APK/AAB
1. Open project in Android Studio: `npm run android:open`
2. Build → Generate Signed Bundle/APK
3. Follow the signing process for Play Store submission

### iOS App
1. Open project in Xcode: `npm run ios:open`
2. Archive and upload to App Store Connect

## Google Play Store Submission

### Prepare for Release

1. **Update version in package.json and capacitor.config.ts**
2. **Generate app icons and splash screens**
3. **Create signed APK/AAB in Android Studio**
4. **Test thoroughly on various devices**

### Play Store Requirements

- **App Icons**: 512x512 PNG (high-res icon)
- **Screenshots**: Phone and tablet screenshots
- **Feature Graphic**: 1024x500 PNG
- **Privacy Policy**: Required for apps handling personal data
- **App Description**: Compelling store listing
- **Content Rating**: Complete questionnaire
- **Target API Level**: Android 13+ (API 33+)

### Store Listing Assets

Create these assets for the Play Store:

- **Short Description** (80 chars): "Preserve & share family memories together"
- **Full Description**: Detailed feature list and benefits
- **Keywords**: family, memories, photos, dementia, elderly, collaboration
- **Screenshots**: Show key features and user interface
- **Feature Graphic**: Branded promotional image

## App Features for Store

### Core Features
- ✅ Family memory timeline
- ✅ Photo/video/audio upload
- ✅ User authentication
- ✅ Responsive design
- ✅ Offline support
- ✅ Native camera integration
- ✅ Share functionality
- ✅ Haptic feedback

### Planned Features
- 🔄 AI-powered memory organization
- 🔄 Memory recall games
- 🔄 Advanced search
- 🔄 Family member invitations
- 🔄 Push notifications
- 🔄 Cloud backup

## Privacy & Security

- End-to-end encryption for sensitive data
- GDPR compliant data handling
- Secure authentication with Supabase
- Family-only access controls
- Local data caching for offline use

## Support

For support and feature requests, contact: support@memorymesh.app

## License

Copyright © 2025 MemoryMesh. All rights reserved.