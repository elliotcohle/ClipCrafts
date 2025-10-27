# Guía de Configuración para macOS

## Requisitos Previos

1. **Node.js** (versión 14 o superior)
   - Descarga desde: https://nodejs.org/
   - Verifica la instalación: `node --version`

## Instalación

### Opción 1: Doble clic (Recomendado)
1. Haz doble clic en `Youtubator.command`
2. Si aparece un error de permisos, ejecuta en Terminal:
   ```bash
   chmod +x Youtubator.command
   ```

### Opción 2: Terminal
1. Abre Terminal
2. Navega a la carpeta del proyecto:
   ```bash
   cd "/ruta/a/Youtubator"
   ```
3. Ejecuta:
   ```bash
   ./Youtubator.sh
   ```

## Solución de Problemas

### Error: "No se puede abrir porque es de un desarrollador no identificado"
1. Haz clic derecho en `Youtubator.command`
2. Selecciona "Abrir"
3. Confirma que deseas abrirlo

O desde Terminal:
```bash
chmod +x Youtubator.command
xattr -d com.apple.quarantine Youtubator.command
```

### Error: "Node.js not found"
1. Instala Node.js desde https://nodejs.org/
2. Reinicia Terminal
3. Verifica: `node --version`

### Error de instalación de dependencias
Si la instalación de Electron falla:

```bash
cd automation/desktop
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Error: "icudtl.dat not found"
Este error indica un problema con la instalación de Electron. Soluciónalo con:

```bash
cd automation/desktop
rm -rf node_modules
npm install electron@latest --save-dev
```

### La aplicación no abre o se cierra inmediatamente
1. Verifica que no haya otro proceso de Electron ejecutándose:
   ```bash
   killall Electron
   ```

2. Reinstala las dependencias:
   ```bash
   cd automation/desktop
   npm install
   ```

3. Intenta ejecutar directamente:
   ```bash
   cd automation/desktop
   npm start
   ```

## Características específicas de macOS

- **Menú de aplicación nativo**: Incluye comandos estándar de macOS
- **Barra de título integrada**: Estilo nativo de macOS
- **Atajos de teclado**: Los atajos estándar de macOS funcionan (⌘C, ⌘V, etc.)
- **Dock**: La aplicación aparece en el Dock cuando está en ejecución

## Permisos

Si necesitas dar permisos de ejecución a todos los scripts:

```bash
chmod +x Youtubator.command
chmod +x Youtubator.sh
chmod +x Youtubator.js
```

## Notas

- La primera ejecución puede tardar unos minutos mientras se descargan las dependencias
- Electron requiere aproximadamente 200MB de espacio en disco
- La aplicación funciona completamente offline después de la instalación inicial
