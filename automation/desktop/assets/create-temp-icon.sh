#!/bin/bash
# Script para crear un icono temporal hasta que se agregue el logo de YouTube

cd "$(dirname "$0")"

echo "🎨 Creando icono temporal..."

# Crear un icono simple usando iconutil
mkdir -p icon.iconset

# Crear imágenes PNG con diferentes tamaños usando sips
# Usaremos un icono del sistema como base temporal
TEMP_ICON="/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/BookmarkIcon.icns"

if [ -f "$TEMP_ICON" ]; then
    # Extraer y redimensionar
    sips -s format png "$TEMP_ICON" --out temp.png > /dev/null 2>&1
    
    # Generar todos los tamaños
    for size in 16 32 64 128 256 512 1024; do
        sips -z $size $size temp.png --out temp_${size}.png > /dev/null 2>&1
    done
    
    # Copiar a iconset con nombres correctos
    cp temp_16.png icon.iconset/icon_16x16.png
    cp temp_32.png icon.iconset/icon_16x16@2x.png
    cp temp_32.png icon.iconset/icon_32x32.png
    cp temp_64.png icon.iconset/icon_32x32@2x.png
    cp temp_128.png icon.iconset/icon_128x128.png
    cp temp_256.png icon.iconset/icon_128x128@2x.png
    cp temp_256.png icon.iconset/icon_256x256.png
    cp temp_512.png icon.iconset/icon_256x256@2x.png
    cp temp_512.png icon.iconset/icon_512x512.png
    cp temp_1024.png icon.iconset/icon_512x512@2x.png
    
    # Convertir a ICNS
    iconutil -c icns icon.iconset -o icon.icns
    
    # Limpiar
    rm -rf icon.iconset temp*.png
    
    echo "✅ Icono temporal creado: icon.icns"
    echo "   Para usar el logo oficial de YouTube, ejecuta:"
    echo "   ./build-icon.sh /ruta/al/youtube-logo.png"
else
    echo "⚠️  No se pudo crear icono temporal"
    echo "   Descarga el logo de YouTube y ejecuta:"
    echo "   ./build-icon.sh /ruta/al/youtube-logo.png"
fi
