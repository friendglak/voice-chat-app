# 🎙️ Voice Chat App - Real-time Voice Messaging Platform

![Vue.js 3.4](https://img.shields.io/badge/Vue.js-3.4-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Nuxt 4.0](https://img.shields.io/badge/Nuxt-4.0-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![TypeScript 5.3](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind 4.0](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Pinia 2.1](https://img.shields.io/badge/Pinia-2.1-FFD859?style=for-the-badge&logo=pinia&logoColor=black)

🚀 Modern real-time voice chat application built with Vue 3 Composition API</h3>

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Testing Real-time Features](#-testing-real-time-features)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Production Build](#-production-build)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Features

- 🎤 **Voice Recording** - Record up to 30 seconds of audio
- 🔊 **Playback Control** - Variable speed playback (1x, 1.5x, 2x)
- 📡 **Real-time Communication** - BroadcastChannel API for instant messaging
- 🎵 **Audio Validation** - Silence detection using AudioContext
- 📊 **Waveform Visualization** - Real-time audio waveform display
- 💾 **Local Storage** - Persistent message history
- 👥 **Multi-room Support** - Different chat rooms for various topics
- 📈 **User Statistics** - Track messages, duration, and activity

### UI/UX Features

- 📱 **Responsive** - Mobile-first design
- ⚡ **Animations** - Smooth transitions and micro-interactions
- ♿ **Accessible** - WCAG 2.1 compliant
- 🌐 **Internationalization Ready** - i18n structure

---

## 🛠 Tech Stack

### Frontend Framework

- **Vue 3.4+** - Composition API with `<script setup>`
- **Nuxt 4** - Full-stack Vue framework
- **TypeScript 5.3** - Type-safe development

### Styling

- **Tailwind CSS v4** - Utility-first CSS framework
- **Custom CSS** - Glass morphism effects
- **CSS Variables** - Dynamic theming

### State Management

- **Pinia 2.1** - Official Vue store
- **Composables** - Reusable logic
- **BroadcastChannel API** - Cross-tab communication

### Build Tools

- **Vite 5** - Fast build tool
- **PostCSS** - CSS processing
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 📦 Installation

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or pnpm 8.x
- Modern browser with Web Audio API support

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/voice-chat-app.git
cd voice-chat-app
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Using pnpm (recommended)
pnpm install
```

### Step 3: Environment Setup

```bash
# Copy environment example
cp .env.example .env

# Edit .env file with your settings
nano .env
```

### Step 4: Run Development Server

```bash
# Start development server
npm run dev

# Server will be available at http://localhost:3000
```

---

## 🧪 Testing Real-time Features

### Method 1: Multiple Browser Tabs (Easiest)

```bash
# 1. Start the development server
npm run dev

# 2. Open http://localhost:3000 in Chrome
# 3. Login with nickname "User1" in room "General"

# 4. Open http://localhost:3000 in a NEW TAB (same browser)
# 5. Login with nickname "User2" in the SAME room "General"

# Both tabs will share the same BroadcastChannel and communicate in real-time!
```

### Method 2: Different Browsers (More Realistic)

```bash
# 1. Open in Chrome
http://localhost:3000
# Login as "Alice"

# 2. Open in Firefox (or Edge)
http://localhost:3000
# Login as "Bob"

# 3. Select the SAME ROOM in both browsers
# Messages will sync via BroadcastChannel API
```

### Method 3: Incognito/Private Windows

```bash
# 1. Normal Window
http://localhost:3000
# Login as "Student1"

# 2. Incognito/Private Window (Ctrl+Shift+N / Cmd+Shift+N)
http://localhost:3000
# Login as "Student2"

# Same room = real-time communication!
```

### Method 4: Multiple Devices (Production-like)

```bash
# 1. Find your local IP
# Windows: ipconfig
# Mac/Linux: ifconfig or ip addr

# 2. Start server with host flag
npm run dev -- --host

# 3. Access from different devices on same network:
# Desktop: http://192.168.1.100:3000
# Phone: http://192.168.1.100:3000
# Tablet: http://192.168.1.100:3000
```

### Testing Checklist

- [ ] Open 2+ tabs/browsers
- [ ] Login with different nicknames
- [ ] Join the SAME room
- [ ] Record a voice message in Tab 1
- [ ] See it appear instantly in Tab 2
- [ ] Test playback controls
- [ ] Change rooms and verify isolation
- [ ] Check online users list updates

---

## 📁 Project Structure

```
voice-chat-app/
├── 📂 assets/
│   └── css/
│       └── main.css              # Global styles + Tailwind imports
├── 📂 components/
│   └── VoiceChat/
│       ├── LoginScreen.vue       # Login component
│       ├── ChatRoom.vue          # Main chat interface
│       ├── VoiceMessage.vue      # Message component
│       └── RecordButton.vue      # Recording controls
├── 📂 composables/
│   ├── useAudioRecorder.ts       # Recording logic
│   ├── useAudioPlayer.ts         # Playback logic
│   └── useBroadcastChannel.ts    # Real-time communication
├── 📂 layouts/
│   └── default.vue               # Default layout
├── 📂 pages/
│   └── index.vue                 # Main page
├── 📂 plugins/
│   └── fontawesome.client.ts    # Icon library
├── 📂 public/
│   ├── favicon.ico
│   └── sounds/                   # Audio assets
├── 📂 server/
│   └── api/                      # API routes (if needed)
├── 📂 stores/
│   └── chat.ts                   # Pinia store
├── 📂 types/
│   └── index.ts                  # TypeScript definitions
├── 📂 utils/
│   └── audio.ts                  # Audio utilities
├── .env.example                   # Environment variables example
├── .eslintrc.js                  # ESLint config
├── .gitignore                     # Git ignore rules
├── app.vue                        # Root component
├── nuxt.config.ts                 # Nuxt configuration
├── package.json                   # Dependencies
├── postcss.config.js              # PostCSS config
├── README.md                      # This file
├── tailwind.config.ts             # Tailwind configuration
└── tsconfig.json                  # TypeScript configuration
```

---

## Configuration

### Nuxt Configuration (`nuxt.config.ts`)

```typescript
export default defineNuxtConfig({
  // Development tools
  devtools: { enabled: true },

  // Modules
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt"],

  // CSS
  css: ["~/assets/css/main.css"],

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // SPA mode for BroadcastChannel
  ssr: false,

  // Vite optimizations
  vite: {
    optimizeDeps: {
      include: ["vue", "pinia"],
    },
  },
});
```

### Environment Variables (`.env`)

```env
# App Configuration
NUXT_PUBLIC_APP_NAME="Voice Chat"
NUXT_PUBLIC_APP_URL="http://localhost:3000"

# Audio Settings
NUXT_PUBLIC_MAX_RECORDING_TIME=30
NUXT_PUBLIC_AUDIO_SAMPLE_RATE=44100

# Storage
NUXT_PUBLIC_MAX_MESSAGES_STORED=50
NUXT_PUBLIC_STORAGE_PREFIX="voiceChat_"

# Feature Flags
NUXT_PUBLIC_ENABLE_BOT_RESPONSES=true
NUXT_PUBLIC_ENABLE_WAVEFORM=true
```

---

## 📖 Usage Guide

### Basic Usage

#### 1. Login

```typescript
// Enter a nickname (3-20 characters)
// Select a chat room
// Click "Join Voice Chat"
```

#### 2. Recording a Message

```typescript
// Hold the microphone button (desktop)
// Tap and hold (mobile)
// Release to send
// Maximum 30 seconds
```

#### 3. Playing Messages

```typescript
// Click play button on any message
// Adjust playback speed (1x, 1.5x, 2x)
// View waveform visualization
```

#### 4. Room Management

```typescript
// Change rooms from dropdown
// Each room has isolated messages
// Online users per room
```

### Advanced Features

#### Custom Rooms

```typescript
// Add new rooms in stores/chat.ts
rooms: [
  { id: "custom", name: "🎯 Custom Room", description: "Your description" },
];
```

#### Audio Settings

```typescript
// Adjust in composables/useAudioRecorder.ts
const audioConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  sampleRate: 44100,
  channelCount: 1,
};
```

---

## 🔌 API Documentation

### Composables

#### `useAudioRecorder()`

```typescript
interface UseAudioRecorder {
  isRecording: Readonly<Ref<boolean>>;
  recordingTime: Readonly<Ref<number>>;
  hasPermission: Readonly<Ref<boolean>>;
  permissionError: Readonly<Ref<string>>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<RecordingResult | null>;
  getWaveform: () => number[];
  requestPermission: () => Promise<boolean>;
}
```

#### `useAudioPlayer()`

```typescript
interface UseAudioPlayer {
  togglePlayback: (message: VoiceMessage) => void;
  setPlaybackSpeed: (message: VoiceMessage, speed: PlaybackSpeed) => void;
  pauseAudio: (message: VoiceMessage) => void;
  cleanup: () => void;
}
```

#### `useBroadcastChannel(channelName: string)`

```typescript
interface UseBroadcastChannel {
  isConnected: Readonly<Ref<boolean>>;
  initialize: (onMessage: Function) => void;
  sendMessage: (message: VoiceMessage) => void;
  announceUserJoined: (user: User) => void;
  announceUserLeft: (userId: string) => void;
  close: () => void;
}
```

### Store Actions

#### Pinia Store (`useChatStore`)

```typescript
// Login user
chatStore.login(nickname: string)

// Add message
chatStore.addMessage(message: VoiceMessage)

// Change room
chatStore.changeRoom(roomId: string)

// Clear messages
chatStore.clearMessages()
```

---

## 💻 Development

### Development Commands

```bash
# Start dev server with HMR
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format

# Clean install
rm -rf node_modules .nuxt .output
npm install
```

### Code Style

```javascript
// ESLint + Prettier configuration
{
  "extends": ["@nuxtjs/eslint-config-typescript"],
  "rules": {
    "vue/multi-word-component-names": "off",
    "vue/max-attributes-per-line": ["error", {
      "singleline": 3,
      "multiline": 1
    }]
  }
}
```

### Git Workflow

```bash
# Feature branch
git checkout -b feature/voice-filters

# Commit with conventional commits
git commit -m "feat: add voice filters"

# Push and create PR
git push origin feature/voice-filters
```

---

## 🚀 Production Build

### Build for Production

```bash
# Build application
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate
```

### Deployment Options

#### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Netlify

```bash
# netlify.toml
[build]
  command = "npm run generate"
  publish = ".output/public"
```

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Performance Optimization

```typescript
// nuxt.config.ts
nitro: {
  prerender: {
    routes: ['/']
  },
  compressPublicAssets: true
}
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
npm run test:unit

# Watch mode
npm run test:unit:watch

# Coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Open Cypress
npm run cypress:open
```

### Test Examples

```typescript
// Example test file: tests/unit/AudioRecorder.spec.ts
import { describe, it, expect } from "vitest";
import { useAudioRecorder } from "~/composables/useAudioRecorder";

describe("AudioRecorder", () => {
  it("should initialize with default values", () => {
    const { isRecording, recordingTime } = useAudioRecorder();
    expect(isRecording.value).toBe(false);
    expect(recordingTime.value).toBe(0);
  });
});
```

---

## 🐛 Troubleshooting

### Common Issues

#### Microphone Permission Denied

```bash
# Chrome: Settings > Privacy > Site Settings > Microphone
# Firefox: Settings > Privacy & Security > Permissions > Microphone
# Ensure localhost:3000 is allowed
```

#### BroadcastChannel Not Working

```javascript
// Check browser compatibility
if (!("BroadcastChannel" in window)) {
  console.error("BroadcastChannel not supported");
  // Use fallback: localStorage + storage event
}
```

#### Audio Not Recording

```javascript
// Check MediaRecorder support
if (!window.MediaRecorder) {
  console.error("MediaRecorder not supported");
}

// Check microphone availability
navigator.mediaDevices.enumerateDevices().then((devices) => {
  const hasMic = devices.some((d) => d.kind === "audioinput");
  console.log("Microphone available:", hasMic);
});
```

#### Build Errors

```bash
# Clear cache
rm -rf .nuxt .output node_modules/.cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version # Should be 18+
```

### Debug Mode

```typescript
// Enable debug logging in .env
NUXT_PUBLIC_DEBUG = true;

// composables/debug.ts
export const debug = (...args: any[]) => {
  if (process.env.NUXT_PUBLIC_DEBUG === "true") {
    console.log("[DEBUG]", ...args);
  }
};
```

---

## 🤝 Contributing

### How to Contribute

1. Fork the repository
2. Create a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation
- Use conventional commits
- Ensure all tests pass

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on what is best for the community

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Voice Chat App

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- Vue.js Team for the amazing framework
- Nuxt Team for the full-stack solution
- Tailwind CSS for the utility-first approach
- Community contributors

---

## 📞 Support

- 📧 Email: support@voicechat.app
- 💬 Discord: [Join our server](https://discord.gg/voicechat)
- 🐦 Twitter: [@voicechatapp](https://twitter.com/voicechatapp)
- 📖 Documentation: [docs.voicechat.app](https://docs.voicechat.app)

---

<div align="center">
  <p>Built with ❤️ using Vue 3 + Nuxt 4 + TypeScript</p>
  <p>⭐ Star us on GitHub!</p>
</div>
