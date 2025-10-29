#!/usr/bin/env node
/* TakeMachine - Cross-platform launcher for Content Management Desktop App */
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const desktopDir = path.join(__dirname, 'automation', 'desktop');
const packageJsonPath = path.join(desktopDir, 'package.json');
const nodeModulesPath = path.join(desktopDir, 'node_modules');

console.log('🎬 TakeMachine - Content Management Platform');
console.log('📍 Platform:', os.platform(), os.arch());
console.log('');

// Check Node.js version
try {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  console.log('✅ Node.js detected:', nodeVersion);
  
  if (majorVersion < 14) {
    console.warn('⚠️  Warning: Node.js 14+ recommended. Current:', nodeVersion);
    console.warn('   Download from: https://nodejs.org/');
  }
} catch (e) {
  console.error('❌ Node.js not detected or error checking version');
}

// Check npm availability
try {
  execSync('npm --version', { stdio: 'pipe' });
  console.log('✅ npm detected');
} catch (e) {
  console.error('❌ npm not found. Please install Node.js from https://nodejs.org/');
  console.error('   Node.js includes npm automatically.');
  process.exit(1);
}

console.log('');

// Check if dependencies are installed
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies (first time only)...');
  console.log('   This may take 1-2 minutes...\n');
  const install = spawn('npm', ['install'], { cwd: desktopDir, stdio: 'inherit' });
  install.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Dependencies installed successfully!');
      console.log('🚀 Starting Youtubator...\n');
      launchApp();
    } else {
      console.error('\n❌ Installation failed. Please try manually:');
      console.error('   cd automation/desktop && npm install');
      process.exit(1);
    }
  });
} else {
  console.log('✅ Dependencies found');
  console.log('🚀 Starting Youtubator...\n');
  launchApp();
}

function launchApp() {
  const start = spawn('npm', ['start'], { cwd: desktopDir, stdio: 'inherit' });
  start.on('close', (code) => {
    process.exit(code || 0);
  });
}
