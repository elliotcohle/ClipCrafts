const { app, BrowserWindow, shell, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

const projectRoot = path.resolve(__dirname, '..', '..');
const contentRoot = path.join(projectRoot, 'content');
const videosRoot = path.join(contentRoot, 'videos');
const shortsRoot = path.join(contentRoot, 'shorts');
const dashPath = path.join(projectRoot, 'DASHBOARD.md');

// Disable GPU cache errors
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disable-http-cache');
app.commandLine.appendSwitch('disable-gpu-compositing');

function createWindow() {
  const windowOptions = {
    width: 1200,
    height: 790,
    title: 'Channel Dashboard',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    show: false,
  };

  // macOS specific window options
  if (process.platform === 'darwin') {
    windowOptions.titleBarStyle = 'hiddenInset';
    windowOptions.trafficLightPosition = { x: 10, y: 10 };
  }

  const win = new BrowserWindow(windowOptions);
  win.once('ready-to-show', () => win.show());
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(() => {
  // Create application menu (important for macOS)
  if (process.platform === 'darwin') {
    const template = [
      {
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'selectAll' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Window',
        submenu: [
          { role: 'minimize' },
          { role: 'zoom' },
          { type: 'separator' },
          { role: 'front' }
        ]
      }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
  
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Suppress GPU cache warnings in console
process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning' || warning.message.includes('cache')) {
    return;
  }
  console.warn(warning);
});

function ensureDirs() {
  for (const p of [contentRoot, videosRoot, shortsRoot]) {
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
  }
}

function removeDiacritics(str) {
  return str.normalize('NFD').replace(/\p{Diacritic}+/gu, '').normalize('NFC');
}
function slugify(text) {
  const t = removeDiacritics(String(text).toLowerCase())
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return t || String(Math.floor(Math.random() * 1e9));
}
function uniqueFolder(dir, base) {
  let candidate = base; let i = 2;
  while (fs.existsSync(path.join(dir, candidate))) candidate = `${base}-${i++}`;
  return candidate;
}

function detectThumbnail(base) {
  const candidates = [
    'thumbnail.jpg','thumbnail.png','thumb.jpg','thumb.png',
    path.join('thumbnails','thumbnail.jpg'), path.join('thumbnails','thumbnail.png')
  ];
  for (const c of candidates) {
    const p = path.join(base, c);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function listPackages() {
  ensureDirs();
  const out = [];
  for (const tuple of [[videosRoot,'video'], [shortsRoot,'short']]) {
    const [root, type] = tuple;
    if (!fs.existsSync(root)) continue;
    for (const name of fs.readdirSync(root)) {
      const pkgPath = path.join(root, name);
      if (!fs.statSync(pkgPath).isDirectory()) continue;
      const metaPath = path.join(pkgPath, type === 'video' ? 'video.meta.json' : 'short.meta.json');
      let meta = { title: name, status: 'draft', topic: '' };
      if (fs.existsSync(metaPath)) {
        try { meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')); } catch {}
      }
      if (!meta.social) meta.social = { youtube:false, instagram:false, tiktok:false, twitter:false, facebook:false };
      
      // Read title from title.txt and sync to meta if needed
      const titlePath = path.join(pkgPath, 'title.txt');
      if (fs.existsSync(titlePath)) {
        const titleFromFile = fs.readFileSync(titlePath, 'utf8').trim();
        if (titleFromFile && titleFromFile !== meta.title) {
          meta.title = titleFromFile;
          // Sync to meta.json
          fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
        }
      }
      
      const thumb = detectThumbnail(pkgPath);
      out.push({
        type, name, path: pkgPath,
        title: meta.title || name,
        status: meta.status || 'draft',
        topic: meta.topic || '',
        thumb: thumb ? `file://${thumb}` : null,
        social: meta.social,
        createdDate: meta.createdDate || '',
        publishDate: meta.publishDate || '',
        score: meta.score || 5
      });
    }
  }
  // Status priority for production workflow (lower = higher priority)
  const statusPriority = {
    'draft': 1,
    'filmed': 2,
    'editing': 3,
    'thumbnail': 4,
    'scheduled': 5,
    'published': 6
  };
  // Sort by: status priority → type (videos first) → title (alphabetical)
  out.sort((a,b) => {
    const statusDiff = (statusPriority[a.status] || 999) - (statusPriority[b.status] || 999);
    if (statusDiff !== 0) return statusDiff;
    if (a.type !== b.type) return a.type === 'video' ? -1 : 1;
    return a.title.localeCompare(b.title);
  });
  return out;
}

function writeMeta(pkgPath, type, updater) {
  const metaPath = path.join(pkgPath, type === 'video' ? 'video.meta.json' : 'short.meta.json');
  let meta = {};
  if (fs.existsSync(metaPath)) {
    try { meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')); } catch {}
  }
  meta = updater(meta) || meta;
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf8');
}

function buildDashboard() {
  const items = listPackages();
  const lines = [];
  lines.push('# Channel Dashboard','');
  lines.push('## Videos');
  const vids = items.filter(i=>i.type==='video');
  if (vids.length===0) lines.push('_No videos yet_');
  for (const it of vids) lines.push(`- [${it.title}](content/videos/${path.basename(it.path)}) - status: ${it.status} - topic: ${it.topic}`);
  lines.push('', '## Shorts');
  const sh = items.filter(i=>i.type==='short');
  if (sh.length===0) lines.push('_No shorts yet_');
  for (const it of sh) lines.push(`- [${it.title}](content/shorts/${path.basename(it.path)}) - status: ${it.status} - topic: ${it.topic}`);
  fs.writeFileSync(dashPath, lines.join('\n'), 'utf8');
}

ipcMain.handle('listPackages', () => listPackages());
ipcMain.handle('updateStatus', (e, pkgPath, type, status) => {
  writeMeta(pkgPath, type, (m) => { m.status = status; m.updatedAt = new Date().toISOString(); if (!m.social) m.social = { youtube:false, instagram:false, tiktok:false, twitter:false, facebook:false }; return m; });
  return true;
});
ipcMain.handle('updateSocial', (e, pkgPath, type, social) => {
  writeMeta(pkgPath, type, (m) => { m.social = Object.assign({ youtube:false, instagram:false, tiktok:false, twitter:false, facebook:false }, social); m.updatedAt = new Date().toISOString(); return m; });
  return true;
});
ipcMain.handle('openPackage', (e, pkgPath) => { shell.openPath(pkgPath); return true; });
ipcMain.handle('getPackageFiles', (e, pkgPath, type) => {
  const files = {};
  const fileMap = type === 'video' 
    ? ['bullets.md','title.txt','description.txt','tags.txt','chapters.txt','thumbnail_brief.md','community_post.txt','shorts_ideas.md','checklist.md']
    : ['script.md','title.txt','caption.txt','hashtags.txt','thumbnail_brief.md'];
  for (const f of fileMap) {
    const p = path.join(pkgPath, f);
    if (fs.existsSync(p)) files[f] = fs.readFileSync(p, 'utf8');
    else files[f] = '';
  }
  return files;
});
ipcMain.handle('savePackageFile', (e, pkgPath, fileName, content) => {
  const p = path.join(pkgPath, fileName);
  fs.writeFileSync(p, content, 'utf8');
  
  // If saving title.txt, update meta.json
  if (fileName === 'title.txt' && content.trim()) {
    const isVideo = fs.existsSync(path.join(pkgPath, 'video.meta.json'));
    const type = isVideo ? 'video' : 'short';
    writeMeta(pkgPath, type, (m) => { 
      m.title = content.trim(); 
      m.updatedAt = new Date().toISOString(); 
      return m; 
    });
  }
  
  return true;
});

ipcMain.handle('updateMetaDates', (e, pkgPath, createdDate, publishDate) => {
  const isVideo = fs.existsSync(path.join(pkgPath, 'video.meta.json'));
  const type = isVideo ? 'video' : 'short';
  writeMeta(pkgPath, type, (m) => {
    if (createdDate) m.createdDate = createdDate;
    if (publishDate) m.publishDate = publishDate;
    m.updatedAt = new Date().toISOString();
    return m;
  });
  return true;
});

ipcMain.handle('updateScore', (e, pkgPath, score) => {
  const isVideo = fs.existsSync(path.join(pkgPath, 'video.meta.json'));
  const type = isVideo ? 'video' : 'short';
  writeMeta(pkgPath, type, (m) => {
    m.score = score;
    m.updatedAt = new Date().toISOString();
    return m;
  });
  return true;
});

ipcMain.handle('buildDashboard', () => { buildDashboard(); return true; });
ipcMain.handle('openDashboard', () => { if (!fs.existsSync(dashPath)) buildDashboard(); shell.openPath(dashPath); return true; });

ipcMain.handle('createPackage', (e, payload) => {
  ensureDirs();
  const { type, title, primaryKeyword = '', topic = (type==='video'?'Reinvention/Travel':'Short: Reinvention/Travel'), timezone = 'ET' } = payload;
  const root = type==='video' ? videosRoot : shortsRoot;
  const slug = slugify(title);
  const folderName = uniqueFolder(root, slug);
  const base = path.join(root, folderName);
  fs.mkdirSync(base, { recursive: true });
  fs.mkdirSync(path.join(base, 'raw', 'video'), { recursive: true });
  fs.mkdirSync(path.join(base, 'raw', 'voiceover'), { recursive: true });

  if (type==='video') {
    fs.writeFileSync(path.join(base, 'bullets.md'), '', 'utf8');
    fs.writeFileSync(path.join(base, 'title.txt'), title, 'utf8');
    fs.writeFileSync(path.join(base, 'description.txt'), '', 'utf8');
    fs.writeFileSync(path.join(base, 'tags.txt'), '', 'utf8');
    fs.writeFileSync(path.join(base, 'chapters.txt'), '', 'utf8');
    fs.writeFileSync(path.join(base, 'thumbnail_brief.md'), '', 'utf8');
    fs.writeFileSync(path.join(base, 'community_post.txt'), '', 'utf8');
    fs.writeFileSync(path.join(base, 'shorts_ideas.md'), '', 'utf8');
    fs.writeFileSync(path.join(base, 'checklist.md'), '', 'utf8');
    const today = new Date().toISOString().slice(0,10);
    const meta = { 
      title, 
      date: today, 
      slug: folderName, 
      topic, 
      primaryKeyword, 
      timezone, 
      status: 'draft', 
      createdDate: today,
      createdAt: new Date().toISOString(), 
      packagePath: base, 
      score: 5,
      social: { youtube:false, instagram:false, tiktok:false, twitter:false, facebook:false } 
    };
    fs.writeFileSync(path.join(base, 'video.meta.json'), JSON.stringify(meta, null, 2), 'utf8');
  } else {
    fs.writeFileSync(path.join(base, 'script.md'), '', 'utf8');
    fs.writeFileSync(path.join(base, 'title.txt'), title, 'utf8');
    fs.writeFileSync(path.join(base, 'caption.txt'), '', 'utf8');
    fs.writeFileSync(path.join(base, 'hashtags.txt'), '', 'utf8');
    fs.writeFileSync(path.join(base, 'thumbnail_brief.md'), '', 'utf8');
    const today = new Date().toISOString().slice(0,10);
    const meta2 = { 
      title, 
      date: today, 
      slug: folderName, 
      topic, 
      primaryKeyword, 
      status: 'draft', 
      packagePath: base, 
      createdDate: today,
      score: 5,
      social: { youtube:false, instagram:false, tiktok:false, twitter:false, facebook:false } 
    };
    fs.writeFileSync(path.join(base, 'short.meta.json'), JSON.stringify(meta2, null, 2), 'utf8');
  }
  return base;
});

ipcMain.handle('createChannel', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
    title: 'Select folder to create new YouTube Channel'
  });
  
  if (result.canceled || !result.filePaths[0]) return null;
  
  const channelRoot = result.filePaths[0];
  const channelName = path.basename(channelRoot);
  
  // Create folder structure
  const folders = [
    'content/videos',
    'content/shorts',
    'templates/video',
    'templates/short',
    'tools',
    'automation/desktop/renderer'
  ];
  
  for (const folder of folders) {
    fs.mkdirSync(path.join(channelRoot, folder), { recursive: true });
  }
  
  // Create README.md
  const readme = `# ${channelName}

YouTube Channel Management System created with TakeMachine.

## Quick Start

### Prerequisites
- Node.js 14+ ([download here](https://nodejs.org/))

### Running the Application

1. Run the launcher for your platform:
   - **Windows**: Double-click \`TakeMachine.bat\`
   - **macOS**: Double-click \`TakeMachine.command\` (or run \`./TakeMachine.sh\` in Terminal)
   - **Linux**: Run \`./TakeMachine.sh\` in terminal

2. Use the desktop app to manage your content

## Structure

- \`content/videos/\` - Video content packages
- \`content/shorts/\` - Short content packages  
- \`templates/\` - Content templates
- \`tools/\` - Utility scripts
- \`automation/\` - Desktop management app

Created: ${new Date().toISOString().slice(0,10)}
`;
  
  fs.writeFileSync(path.join(channelRoot, 'README.md'), readme, 'utf8');
  
  // Create DASHBOARD.md
  const dashboard = `# Channel Dashboard

## Videos
_No videos yet_

## Shorts
_No shorts yet_
`;
  
  fs.writeFileSync(path.join(channelRoot, 'DASHBOARD.md'), dashboard, 'utf8');
  
  // Copy automation folder contents
  const automationSrc = path.join(__dirname);
  const automationDest = path.join(channelRoot, 'automation', 'desktop');
  
  // Copy essential files
  const filesToCopy = ['main.js', 'preload.js', 'package.json'];
  for (const file of filesToCopy) {
    const src = path.join(automationSrc, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(automationDest, file));
    }
  }
  
  // Copy renderer folder
  const rendererSrc = path.join(automationSrc, 'renderer');
  const rendererDest = path.join(automationDest, 'renderer');
  if (fs.existsSync(rendererSrc)) {
    const rendererFiles = ['index.html', 'style.css', 'renderer.js'];
    for (const file of rendererFiles) {
      const src = path.join(rendererSrc, file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(rendererDest, file));
      }
    }
  }
  
  // Create TakeMachine.js launcher
  const launcherContent = fs.readFileSync(path.join(projectRoot, 'TakeMachine.js'), 'utf8');
  fs.writeFileSync(path.join(channelRoot, 'TakeMachine.js'), launcherContent, 'utf8');
  
  // Create platform wrappers
  const batContent = `@echo off\nnode TakeMachine.js\npause\n`;
  fs.writeFileSync(path.join(channelRoot, 'TakeMachine.bat'), batContent, 'utf8');
  
  const shContent = `#!/bin/bash\n# TakeMachine launcher for Linux/macOS terminal\n\n# Get the directory where this script is located\nSCRIPT_DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"\n\n# Change to that directory\ncd "$SCRIPT_DIR"\n\n# Run the launcher\nnode TakeMachine.js\n`;
  fs.writeFileSync(path.join(channelRoot, 'TakeMachine.sh'), shContent, 'utf8');
  
  const commandContent = `#!/bin/bash\n# TakeMachine launcher for macOS\n# This script can be executed by double-clicking in Finder\n\n# Get the directory where this script is located\nSCRIPT_DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"\n\n# Change to that directory\ncd "$SCRIPT_DIR"\n\n# Check if Node.js is installed\nif ! command -v node &> /dev/null; then\n    echo "❌ Node.js is not installed."\n    echo "Please install Node.js from https://nodejs.org/"\n    echo ""\n    echo "Press any key to exit..."\n    read -n 1\n    exit 1\nfi\n\n# Run the launcher\nnode TakeMachine.js\n\n# Keep terminal open if there was an error\nif [ $? -ne 0 ]; then\n    echo ""\n    echo "Press any key to exit..."\n    read -n 1\nfi\n`;
  fs.writeFileSync(path.join(channelRoot, 'TakeMachine.command'), commandContent, 'utf8');
  
  // Set execute permissions on Unix scripts
  if (process.platform !== 'win32') {
    try {
      fs.chmodSync(path.join(channelRoot, 'TakeMachine.sh'), 0o755);
      fs.chmodSync(path.join(channelRoot, 'TakeMachine.command'), 0o755);
    } catch (e) {
      console.warn('Could not set execute permissions:', e);
    }
  }
  
  // Create .gitignore
  const gitignore = `# Dependencies\nnode_modules/\npackage-lock.json\n\n# macOS\n.DS_Store\n.AppleDouble\n.LSOverride\n._*\n\n# Windows\nThumbs.db\ndesktop.ini\n\n# Logs\n*.log\nnpm-debug.log*\n\n# Editor directories\n.vscode/\n.idea/\n\n# Build outputs\ndist/\nbuild/\n`;
  fs.writeFileSync(path.join(channelRoot, '.gitignore'), gitignore, 'utf8');
  
  return channelRoot;
});

ipcMain.handle('saveThumbnail', (e, pkgPath, imageDataUrl) => {
  // Convert base64 data URL to buffer
  const base64Data = imageDataUrl.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Save as thumbnail.jpg
  const thumbnailPath = path.join(pkgPath, 'thumbnail.jpg');
  fs.writeFileSync(thumbnailPath, buffer);
  
  return thumbnailPath;
});

ipcMain.handle('deleteThumbnail', (e, pkgPath) => {
  // Delete all possible thumbnail files
  const candidates = [
    'thumbnail.jpg', 'thumbnail.png', 'thumb.jpg', 'thumb.png',
    path.join('thumbnails', 'thumbnail.jpg'),
    path.join('thumbnails', 'thumbnail.png')
  ];
  
  let deleted = false;
  for (const candidate of candidates) {
    const thumbPath = path.join(pkgPath, candidate);
    if (fs.existsSync(thumbPath)) {
      fs.unlinkSync(thumbPath);
      deleted = true;
    }
  }
  
  return deleted;
});

ipcMain.handle('deletePackage', (e, pkgPath, type) => {
  try {
    // Verify the path exists
    if (!fs.existsSync(pkgPath)) {
      throw new Error('Package path does not exist');
    }
    
    // Security check: ensure we're deleting from content folder
    const normalizedPath = path.normalize(pkgPath);
    const normalizedContent = path.normalize(contentRoot);
    
    if (!normalizedPath.startsWith(normalizedContent)) {
      throw new Error('Invalid deletion path - must be within content folder');
    }
    
    // Recursively delete the directory
    fs.rmSync(pkgPath, { recursive: true, force: true });
    
    return { success: true, message: 'Package deleted successfully' };
  } catch (error) {
    console.error('Error deleting package:', error);
    throw error;
  }
});


