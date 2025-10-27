#!/bin/bash
# Script para generar icono ICNS desde PNG

if [ -z "$1" ]; then
    echo "Uso: ./build-icon.sh <ruta-al-logo.png>"
    echo "Ejemplo: ./build-icon.sh ~/Downloads/youtube-logo.png"
    exit 1
fi

INPUT_PNG="$1"

if [ ! -f "$INPUT_PNG" ]; then
    echo "Error: No se encuentra el archivo $INPUT_PNG"
    exit 1
fi

echo "🎨 Generando iconos desde $INPUT_PNG..."

# Crear directorio temporal
mkdir -p icon.iconset

# Generar todos los tamaños
sips -z 16 16     "$INPUT_PNG" --out icon.iconset/icon_16x16.png > /dev/null 2>&1
sips -z 32 32     "$INPUT_PNG" --out icon.iconset/icon_16x16@2x.png > /dev/null 2>&1
sips -z 32 32     "$INPUT_PNG" --out icon.iconset/icon_32x32.png > /dev/null 2>&1
sips -z 64 64     "$INPUT_PNG" --out icon.iconset/icon_32x32@2x.png > /dev/null 2>&1
sips -z 128 128   "$INPUT_PNG" --out icon.iconset/icon_128x128.png > /dev/null 2>&1
sips -z 256 256   "$INPUT_PNG" --out icon.iconset/icon_128x128@2x.png > /dev/null 2>&1
sips -z 256 256   "$INPUT_PNG" --out icon.iconset/icon_256x256.png > /dev/null 2>&1
sips -z 512 512   "$INPUT_PNG" --out icon.iconset/icon_256x256@2x.png > /dev/null 2>&1
sips -z 512 512   "$INPUT_PNG" --out icon.iconset/icon_512x512.png > /dev/null 2>&1
sips -z 1024 1024 "$INPUT_PNG" --out icon.iconset/icon_512x512@2x.png > /dev/null 2>&1

# Convertir a ICNS
echo "📦 Creando archivo ICNS..."
iconutil -c icns icon.iconset -o icon.icns

# Limpiar
rm -rf icon.iconset

if [ -f "icon.icns" ]; then
    echo "✅ Icono creado exitosamente: icon.icns"
    echo "   El icono está listo para usar en la compilación."
else
    echo "❌ Error al crear el icono"
    exit 1
fi
