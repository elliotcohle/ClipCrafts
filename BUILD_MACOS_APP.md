# Cómo crear la aplicación para macOS

Esta guía te ayudará a crear una aplicación macOS completa con icono personalizado que se puede instalar en la carpeta Aplicaciones.

## Paso 1: Preparar el icono de YouTube

### Opción A: Descargar un logo de YouTube
1. Descarga un logo oficial de YouTube desde:
   - https://www.youtube.com/about/brand-resources/
   - O busca "YouTube logo PNG transparent 1024x1024"
2. Guarda el archivo como `youtube-logo.png`

### Opción B: Crear icono desde una imagen existente
Si ya tienes una imagen del logo de YouTube:

```bash
cd automation/desktop/assets
./build-icon.sh /ruta/a/tu/youtube-logo.png
```

Esto creará el archivo `icon.icns` necesario.

## Paso 2: Instalar dependencias y empaquetar

Desde la carpeta local del proyecto:

```bash
cd ~/Youtubator-local/automation/desktop

# Instalar electron-builder
npm install

# Construir la aplicación
npm run build
```

Esto creará:
- `dist/Youtubator-0.1.0-arm64.dmg` - Instalador DMG
- `dist/mac-arm64/Youtubator.app` - Aplicación lista para usar

## Paso 3: Instalar en Aplicaciones

### Opción A: Usar el DMG
1. Abre el archivo `.dmg` generado en `dist/`
2. Arrastra Youtubator a la carpeta Aplicaciones

### Opción B: Copiar directamente
```bash
cp -R ~/Youtubator-local/automation/desktop/dist/mac-arm64/Youtubator.app /Applications/
```

## Paso 4: Ejecutar desde Aplicaciones

Ahora puedes:
- Abrir desde Spotlight: Presiona `⌘ + Espacio` y escribe "Youtubator"
- Abrir desde Launchpad
- Abrir desde `/Applications/Youtubator.app`

## Solución de problemas

### "La aplicación no se puede abrir porque es de un desarrollador no identificado"

```bash
xattr -cr /Applications/Youtubator.app
```

Luego haz clic derecho → Abrir

### Actualizar el icono después de instalarlo

Si cambias el icono y reconstruyes:

```bash
cd ~/Youtubator-local/automation/desktop
rm -rf dist
npm run build
cp -R dist/mac-arm64/Youtubator.app /Applications/
```

## Crear DMG para distribución

Para crear un instalador elegante:

```bash
npm run build-dmg
```

Esto genera un archivo DMG que puedes compartir con otros usuarios.

## Notas importantes

- La aplicación solo funciona desde disco local (no desde unidades de red)
- El icono debe estar en formato `.icns` para macOS
- Si no agregas un icono personalizado, usará el icono por defecto de Electron
- La primera construcción puede tardar varios minutos

## Sincronizar cambios desde el NAS

Si haces cambios en el NAS y quieres actualizar la aplicación:

```bash
# Sincronizar archivos (excepto node_modules)
rsync -av --exclude='node_modules' --exclude='dist' "/Volumes/Elliot Cohle/Youtubator/" ~/Youtubator-local/

# Reconstruir
cd ~/Youtubator-local/automation/desktop
npm run build

# Reinstalar
cp -R dist/mac-arm64/Youtubator.app /Applications/
```
