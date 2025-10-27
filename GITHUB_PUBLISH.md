# Publicar Youtubator en GitHub

Guía paso a paso para publicar este proyecto en GitHub.

## Paso 1: Crear el Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `youtubator`
3. Descripción: `Professional YouTube Channel Management System with Desktop App`
4. Público o Privado: Tu elección
5. **NO** marques "Initialize this repository with a README" (ya tenemos uno)
6. Clic en "Create repository"

## Paso 2: Preparar el Proyecto Localmente

Desde la carpeta del proyecto en tu disco local:

```bash
cd ~/Youtubator-local

# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Youtubator v0.1.0

- Cross-platform desktop app for YouTube channel management
- Video and Shorts workflow management
- Status tracking and social media distribution
- Built with Electron 31
- macOS app with custom YouTube icon"

# Conectar con GitHub (reemplaza YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/youtubator.git

# Cambiar a branch main
git branch -M main

# Subir el código
git push -u origin main
```

## Paso 3: Configurar el Repositorio en GitHub

### Agregar Topics
En GitHub → Settings → Topics, agrega:
- `electron`
- `youtube`
- `content-management`
- `desktop-app`
- `nodejs`
- `macos`
- `windows`
- `linux`

### Agregar Descripción
"🎬 Professional YouTube Channel Management System - Desktop app for organizing video content, tracking workflow, and managing multi-platform distribution"

### Website
Si tienes un sitio web o página de documentación, agrégalo aquí

## Paso 4: Crear la Primera Release

1. Ve a "Releases" → "Create a new release"
2. Tag version: `v0.1.0`
3. Release title: `Youtubator v0.1.0 - Initial Release`
4. Descripción:
   ```markdown
   # 🎉 Youtubator v0.1.0 - Initial Release
   
   Professional YouTube Channel Management System
   
   ## ✨ Features
   - Video and Shorts management
   - Workflow status tracking
   - Social media distribution tracking
   - Thumbnail planning
   - Content dashboard
   - Cross-platform support
   
   ## 📦 Downloads
   Choose the appropriate version for your platform:
   
   ### macOS
   - **Apple Silicon (M1/M2/M3)**: `Youtubator-0.1.0-arm64.dmg`
   - **Intel**: `Youtubator-0.1.0-x64.dmg`
   
   ### Windows
   - `Youtubator-Setup-0.1.0.exe`
   
   ### Linux
   - Debian/Ubuntu: `youtubator_0.1.0_amd64.deb`
   - AppImage: `Youtubator-0.1.0.AppImage`
   
   ## 🚀 Installation
   See [README.md](https://github.com/YOUR_USERNAME/youtubator#readme) for installation instructions.
   
   ## 📝 Notes
   First stable release of Youtubator!
   ```

5. Subir los archivos compilados:
   - Arrastra el archivo DMG desde `~/Youtubator-local/automation/desktop/dist/`
   - Si tienes versiones para Windows/Linux, súbelas también

6. Clic en "Publish release"

## Paso 5: Mejorar el README (Opcional)

### Agregar Screenshots
1. Toma capturas de pantalla de la app
2. Súbelas a la carpeta `screenshots/`
3. Actualiza el README para mostrarlas

### Agregar Badge de Release
En el README, agrega:
```markdown
![Release](https://img.shields.io/github/v/release/YOUR_USERNAME/youtubator)
![Downloads](https://img.shields.io/github/downloads/YOUR_USERNAME/youtubator/total)
```

## Paso 6: Promocionar el Proyecto

- Comparte el repositorio en redes sociales
- Publica en Reddit (r/youtube, r/electronjs)
- Comparte en comunidades de creadores de contenido
- Considera agregar el proyecto a lists como Awesome Electron

## Comandos Útiles para el Futuro

### Actualizar el repositorio
```bash
cd ~/Youtubator-local
git add .
git commit -m "Descripción de los cambios"
git push
```

### Crear una nueva versión
```bash
# Actualizar versión en package.json
# Luego:
git add .
git commit -m "Release v0.2.0"
git tag v0.2.0
git push && git push --tags
```

### Sincronizar desde el NAS
```bash
rsync -av --exclude='node_modules' --exclude='dist' --exclude='.git' \
  "/Volumes/Elliot Cohle/Youtubator/" ~/Youtubator-local/
```

## Notas Importantes

- ⚠️ **No subas** archivos de `node_modules/` (ya está en .gitignore)
- ⚠️ **No subas** tu contenido personal de `content/videos/` y `content/shorts/` si es privado
- ✅ **Sí sube** el código fuente, documentación y assets
- ✅ Los archivos compilados (.dmg, .exe) van en Releases, no en el repositorio

## Troubleshooting

### "Permission denied (publickey)"
Configura SSH keys o usa HTTPS con Personal Access Token

### Archivos muy grandes
GitHub tiene límite de 100MB por archivo. Los archivos compilados grandes deben ir en Releases.

### El ícono no aparece
Asegúrate de que `assets/icon.icns` esté en el repositorio (no está en .gitignore)
