# 🎬 ClipCrafts

> **Professional Content Production Management Tool for All Platforms**  
> Streamline your video content workflow for YouTube, TikTok, Instagram, and more.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-31.0-blue.svg)](https://www.electronjs.org/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com/elliotcohle/clipcrafts)

**ClipCrafts** is a powerful desktop application designed for content creators, YouTubers, TikTokers, and video producers who need to manage multiple video projects efficiently. Track your entire production pipeline from draft to published with an intuitive, modern interface.

## 🌟 Why ClipCrafts?

Perfect for:
- 🎥 **YouTubers** managing multiple video projects
- 📱 **Content Creators** posting across platforms (TikTok, Instagram, YouTube Shorts)
- 🎬 **Video Producers** tracking production workflows
- 📊 **Social Media Managers** organizing video content calendars
- ✍️ **Creators** who want to stay organized and productive



## ✨ Key Features

### 🎯 Content Management
- 📹 **Video & Shorts Management** - Organize full-length videos and short-form content
- 🗂️ **Multi-Platform Support** - YouTube, TikTok, Instagram, Twitter, Facebook tracking
- 📝 **Complete Metadata** - Titles, descriptions, tags, thumbnails, chapters, and more

### � Modern Interface
- 📊 **Dual View Modes** - Switch between table and visual card/grid layouts
- 🌓 **Dark/Light Themes** - Eye-friendly modes with persistent preferences
- 🎨 **Modern Design** - Gradient-based UI with smooth animations
- ⚡ **Fast & Responsive** - Built with performance in mind

### 📈 Workflow Tracking
- 🔄 **Status Pipeline** - Draft → Filmed → Editing → Thumbnail → Scheduled → Published
- ⭐ **Content Scoring** - Rate and prioritize your best ideas (1-10 scale)
- 📅 **Date Tracking** - Track creation and publish dates
- 🎯 **Topic Organization** - Categorize content by topic and keywords

### 🛠️ Power Features
- 🔍 **Advanced Search & Filters** - Find content instantly by title, status, or type
- ⌨️ **Keyboard Shortcuts** - Speed up your workflow
- 📊 **Report Generation** - Export Markdown dashboards
- 🗑️ **Safe Deletion** - Double confirmation to prevent accidents
- � **Auto-Save** - Never lose your work

## 🚀 Quick Start

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/elliotcohle/clipcrafts.git
cd clipcrafts
```

2. **Install dependencies:**
```bash
cd automation/desktop
npm install
```

3. **Launch the app:**
```bash
npm start
```

### Platform-Specific Launchers

**Windows:**
```bash
Youtubator.bat
```

**macOS:**
```bash
./Youtubator.command
```

**Linux:**
```bash
./Youtubator.sh
```

> 💡 **First time on macOS?** Check [MACOS_SETUP.md](MACOS_SETUP.md) for setup instructions.

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

## 📖 How to Use

### Creating Your First Content

1. **Click "➕ Create" tab**
2. **Select type:** Video or Short
3. **Enter details:** Title, keywords, topic
4. **Start creating!** Your content package is ready

### Managing Content

| Action | How To |
|--------|--------|
| **Edit Content** | Click ✏️ Edit button |
| **Change Status** | Click on status pill (cycles through workflow) |
| **Rate Quality** | Use score slider (1-10) |
| **Track Platforms** | Toggle social media icons |
| **Delete Content** | Click 🗑️ (requires double confirmation) |
| **Switch Views** | Use 📋 (Table) or 🔲 (Grid) buttons |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + T` | Toggle dark/light mode |
| `Ctrl/Cmd + F` | Focus search bar |
| `Ctrl/Cmd + R` | Refresh content |
| `Ctrl/Cmd + N` | Create new content |
| `Ctrl/Cmd + D` | Go to dashboard |
| `Escape` | Close editor |

### Production Workflow Stages

1. 📝 **Draft** - Brainstorming and planning
2. 🎬 **Filmed** - Recording completed
3. ✂️ **Editing** - Post-production in progress
4. 🖼️ **Thumbnail** - Creating thumbnail
5. 📅 **Scheduled** - Ready for publication
6. ✅ **Published** - Live on platforms

## � Project Structure

```
clipcrafts/
├── content/
│   ├── videos/              # Video content packages
│   └── shorts/              # Short-form content
├── automation/
│   └── desktop/
│       ├── main.js          # Electron main process
│       ├── preload.js       # IPC bridge
│       └── renderer/        # UI files
├── templates/               # Content templates
└── DASHBOARD.md            # Auto-generated reports
```

### Content Package Files

**Videos include:**
- Scripts, titles, descriptions, tags
- Chapters and thumbnail briefs
- Community posts and shorts ideas
- Metadata and raw footage folders

**Shorts include:**
- Scripts, captions, hashtags
- Metadata and raw footage

## 🛠️ For Developers

### Tech Stack

- **Electron 31.0** - Cross-platform desktop framework
- **Node.js** - Backend runtime
- **Vanilla JS** - No framework dependencies
- **CSS Variables** - Dynamic theming

### Development

```bash
cd automation/desktop
npm install
npm start
```

### Building

```bash
npm run build      # Current platform
npm run build-all  # All platforms
```

See [BUILD_MACOS_APP.md](BUILD_MACOS_APP.md) and [QUICK_BUILD.md](QUICK_BUILD.md) for details.

## 🤝 Contributing

We welcome contributions! 

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Found a Bug?

[Report it here](https://github.com/elliotcohle/clipcrafts/issues) - we appreciate your feedback!

## 📄 License

MIT License - Free to use for personal and commercial projects.

## 🌟 Star Us!

If ClipCrafts helps your workflow, give us a ⭐ on GitHub!

## 🔗 Links

- 🐛 [Report Bug](https://github.com/elliotcohle/clipcrafts/issues)
- 💡 [Request Feature](https://github.com/elliotcohle/clipcrafts/issues)
- 📚 [Documentation](https://github.com/elliotcohle/clipcrafts)
- 💬 [Discussions](https://github.com/elliotcohle/clipcrafts/discussions)

---

## � Perfect For

- **Content Creators** producing videos for multiple platforms
- **YouTubers** managing consistent upload schedules
- **Social Media Managers** coordinating video campaigns
- **Video Production Teams** tracking collaborative projects
- **Freelancers** organizing client video work

## 📊 SEO Keywords

video content management, youtube content planner, video production workflow, content creator tools, video project manager, youtube studio alternative, tiktok content planner, instagram reels manager, video editing workflow, content calendar for videos, youtube channel management, shorts content manager, video metadata organizer, content creator dashboard, multi-platform video manager

---

**Built with ❤️ for content creators worldwide**

*ClipCrafts - Craft your content, streamline your workflow*
