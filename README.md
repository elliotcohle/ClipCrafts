# 🎬 Youtubator

> Professional YouTube Channel Management System with Desktop App

A powerful, cross-platform desktop application built with Electron for managing your YouTube content workflow - from ideation to publication.

![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey)
![Electron](https://img.shields.io/badge/Electron-31.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 📹 **Video Management** - Organize full-length videos with scripts, titles, descriptions, and tags
- 🎞️ **Shorts Management** - Manage YouTube Shorts with captions and hashtags
- 📊 **Status Tracking** - Track content through workflow: Draft → Filmed → Editing → Thumbnail → Scheduled → Published
- 🌐 **Social Media Integration** - Track distribution across YouTube, Instagram, TikTok, Twitter, and Facebook
- 🎨 **Thumbnail Planning** - Create and manage thumbnail briefs
- 📝 **Content Organization** - Structured folders for raw footage, voiceovers, and exports
- 📈 **Dashboard** - Auto-generated markdown dashboard of all your content
- ⭐ **Content Scoring** - Rate and prioritize your content ideas
- 📅 **Date Tracking** - Track creation and publish dates

## 🚀 Quick Start

### Prerequisites

- **Node.js 14+** ([download here](https://nodejs.org/))

### Installation

**macOS:**
```bash
# Download and install
open Youtubator-0.1.0-arm64.dmg

# Or run from source
./Youtubator.command
```

**Windows:**
```bash
Youtubator.bat
```

**Linux:**
```bash
./Youtubator.sh
```

### macOS Users

If you encounter issues on macOS, see [MACOS_SETUP.md](MACOS_SETUP.md) for detailed setup instructions.

To build the macOS app yourself, see [BUILD_MACOS_APP.md](BUILD_MACOS_APP.md).

## 📁 Project Structure

```
Youtubator/
├── content/
│   ├── videos/          # Video content packages
│   └── shorts/          # Short content packages
├── templates/
│   ├── video/           # Video templates
│   └── short/           # Shorts templates
├── automation/
│   └── desktop/         # Electron desktop app
├── tools/               # Utility scripts
└── DASHBOARD.md         # Auto-generated content dashboard
```

## 🎯 Workflow

### Creating Content

1. Launch Youtubator
2. Click "New Video" or "New Short"
3. Fill in the title and details
4. Organize your files in the created package folder

### Content Package Structure

Each video/short gets its own folder with:

**Videos:**
- `bullets.md` - Video outline/script
- `title.txt` - Video title
- `description.txt` - YouTube description
- `tags.txt` - Video tags
- `chapters.txt` - Video chapters
- `thumbnail_brief.md` - Thumbnail design notes
- `community_post.txt` - Post-publish community post
- `shorts_ideas.md` - Ideas for shorts from this video
- `video.meta.json` - Metadata and status
- `raw/` - Raw footage and voiceovers

**Shorts:**
- `script.md` - Short script
- `title.txt` - Short title
- `caption.txt` - Caption text
- `hashtags.txt` - Hashtags
- `short.meta.json` - Metadata and status
- `raw/` - Raw footage

## 🛠️ Development

### Run from Source

```bash
cd automation/desktop
npm install
npm start
```

### Build for Distribution

**macOS:**
```bash
cd automation/desktop
npm run build
```

**All platforms:**
```bash
npm run build-all
```

## 📦 Building the App

See platform-specific build guides:
- [macOS Build Guide](BUILD_MACOS_APP.md)
- [Quick Build Steps](QUICK_BUILD.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this for your own YouTube channels!

## 🎬 About

Created for content creators who want a professional workflow management system for their YouTube channels.

**Key Benefits:**
- ✅ Organize content in one place
- ✅ Track progress through production pipeline
- ✅ Never lose track of video ideas
- ✅ Manage multi-platform distribution
- ✅ Keep all assets organized per video

---

**Built with:** Electron, Node.js, HTML/CSS/JavaScript

**Platform:** Works on macOS, Windows, and Linux

Created: 2025-10-27
