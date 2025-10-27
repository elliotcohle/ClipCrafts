# Pasos Rápidos para Crear la App

## 1. Conseguir el logo de YouTube

Descarga el logo oficial desde: https://www.youtube.com/about/brand-resources/

O busca en Google: "YouTube logo PNG 1024x1024 transparent"

## 2. Crear el icono

```bash
cd ~/Youtubator-local/automation/desktop/assets
./build-icon.sh ~/Downloads/youtube-logo.png
```

## 3. Compilar la aplicación

```bash
cd ~/Youtubator-local/automation/desktop
npm run build
```

Esto tardará 1-2 minutos la primera vez.

## 4. Instalar en Aplicaciones

```bash
open dist/*.dmg
```

Luego arrastra Youtubator a la carpeta Aplicaciones.

O directamente:

```bash
cp -R dist/mac-arm64/Youtubator.app /Applications/
xattr -cr /Applications/Youtubator.app
```

## 5. ¡Listo!

Abre Youtubator desde:
- Spotlight (⌘ + Espacio → "Youtubator")
- Launchpad
- Carpeta Aplicaciones

---

**Nota:** Si no tienes el logo de YouTube ahora, puedes compilar sin icono personalizado y agregarlo después.
