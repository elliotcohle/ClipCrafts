# Icono de la Aplicación

Para crear el icono de la aplicación con el logo de YouTube, necesitas:

## Opción 1: Usar un generador online (Más fácil)

1. Descarga el logo de YouTube en formato PNG (1024x1024 px mínimo)
2. Ve a https://cloudconvert.com/png-to-icns
3. Convierte el PNG a ICNS
4. Guarda el archivo como `icon.icns` en esta carpeta

## Opción 2: Crear con iconutil (macOS)

1. Descarga el logo de YouTube
2. Ejecuta el script: `./build-icon.sh /path/to/youtube-logo.png`

## Opción 3: Manual con sips

```bash
# Crear el conjunto de iconos
mkdir icon.iconset

# Generar todos los tamaños necesarios
sips -z 16 16     logo.png --out icon.iconset/icon_16x16.png
sips -z 32 32     logo.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     logo.png --out icon.iconset/icon_32x32.png
sips -z 64 64     logo.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   logo.png --out icon.iconset/icon_128x128.png
sips -z 256 256   logo.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   logo.png --out icon.iconset/icon_256x256.png
sips -z 512 512   logo.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   logo.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 logo.png --out icon.iconset/icon_512x512@2x.png

# Convertir a ICNS
iconutil -c icns icon.iconset -o icon.icns

# Limpiar
rm -rf icon.iconset
```

## Icono por defecto

Si no agregas un icono personalizado, Electron usará su icono predeterminado.
