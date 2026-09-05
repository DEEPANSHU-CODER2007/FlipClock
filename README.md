# 🕐 FlipClock — Premium Time Management App

<div align="center">

![FlipClock Banner](https://img.shields.io/badge/FlipClock-Premium%20Web%20App-black?style=for-the-badge&logo=clock&logoColor=white)

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**A beautiful, feature-rich flip clock application with premium dark aesthetics.**

[🌐 Live Demo](#) • [📸 Screenshots](#screenshots) • [🚀 Features](#features) • [🛠️ Setup](#setup)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🕐 **Flip Clock** | Stunning analog-style flip animation with AM/PM indicator |
| ⏱️ **Stopwatch** | Precision stopwatch with Start, Pause & Reset |
| ⏳ **Countdown Timer** | Set custom H:M:S countdown with visual flip cards |
| 🔔 **Multi-Alarm System** | iOS-style alarms with toggle switches, snooze & browser notifications |
| 🌍 **World Clock** | Add cities worldwide and view their time in real-time |
| 🎬 **Fullscreen Mode** | Press `F` to toggle YouTube-style fullscreen |
| 🔊 **Alarm Sound** | Loud mechanical alarm with system push notifications |
| 💾 **Persistent Storage** | All settings and alarms saved via LocalStorage |
| 🌙 **Dark Theme** | Premium dark mode with glassmorphism design |

---

## 📸 Screenshots

> The app features a premium dark aesthetic with smooth flip card animations.

**Main Clock View**
- Large flip cards with 3D perspective animation
- AM/PM indicator with HOURS / MINUTES / SECONDS labels

**Multi-Alarm System**
- Phone-style alarm list with iOS toggle switches
- Blue FAB (+) button to add new alarms
- Snooze (5 min) and Stop buttons on alarm ring overlay

**World Clock**
- Grid layout showing multiple city clocks
- Real-time updates every second

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18+`
- npm or yarn

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/DEEPANSHU-CODER2007/FlipClock.git

# 2. Navigate into the project
cd FlipClock

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `F` | Toggle Fullscreen mode |

---

## 🏗️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 8
- **Icons:** Lucide React
- **Fonts:** Oswald (Google Fonts) for numbers, Inter for UI
- **Storage:** Browser LocalStorage for persistence
- **Notifications:** Web Notifications API

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Alarm/          # Multi-alarm UI with iOS toggles
│   ├── Clock/          # Main flip clock display
│   ├── Countdown/      # Countdown timer
│   ├── ControlBar/     # Navigation bar
│   ├── FlipCard/       # Core flip card animation
│   ├── Stopwatch/      # Stopwatch UI
│   └── WorldClock/     # World clock grid
├── hooks/
│   ├── useAlarm.ts     # Multi-alarm logic with snooze
│   ├── useClock.ts     # Real-time clock hook
│   ├── useCountdown.ts # Countdown with absolute time
│   ├── useStopwatch.ts # Stopwatch with drift prevention
│   └── useWorldClock.ts# World timezone management
├── context/
│   └── SettingsContext.tsx  # Global settings (12/24h, etc.)
└── App.tsx             # Root: alarm monitor + fullscreen
```

---

## 🔔 Alarm System

The alarm system is designed to be reliable even in background tabs:

- ✅ **No missed alarms** — Uses absolute time matching, not `setSeconds === 0`
- ✅ **Browser throttle-proof** — Checks `hour + minute` window, not exact second
- ✅ **Snooze support** — 5-minute snooze with auto re-trigger
- ✅ **Push notifications** — System-level notification when alarm fires
- ✅ **Loud sound** — Mechanical alarm clock audio, looped until dismissed

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 👨‍💻 Author

**Deepanshu** — [@DEEPANSHU-CODER2007](https://github.com/DEEPANSHU-CODER2007)

---

<div align="center">

⭐ **If you like this project, please give it a star!** ⭐

Made with ❤️ and React

</div>
