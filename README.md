# R&R SoftTech
Empresa Informática de múltiples servicios incluidos. Edición de Software, aplicaciones móviles entre otros.

## Estructura
- `index.html`, `valora.html`, `servicios.html`, `nosotros.html`, `proceso.html`, `contacto.html` (español) y `en/` (inglés).
- `css/`, `js/script.js`, `sw.js` (service worker) y `manifest.webmanifest` (web instalable como app).
- `assets/` imágenes, brochure PDF y `qr-valora-descarga.png`.
- `MARKETING_Valora.md`: textos listos para publicar.

## Descarga de Valora (instalador para Windows)
El instalador **no** va dentro de la web: se publica como *Release* de GitHub y la web enlaza a él.
- Enlace actual: `https://github.com/losramosdelrey/R-R-SoftTech/releases/download/v.2.9.4/Valora_Setup_2.9.4.exe`
- Aparece en `valora.html` y `en/valora.html` (botón de la sección `#descargar` y datos estructurados JSON-LD).
- **Para una versión nueva:** crea otra Release con su `.exe`, y reemplaza el enlace anterior en esos dos archivos
  (buscar `releases/download/v.2.9.4/Valora_Setup_2.9.4.exe` y `releases/tag/v.2.9.4`). Cambia también el texto «v2.9.4».
- El nombre del archivo en el enlace debe coincidir exactamente con el de la Release (mayúsculas incluidas).
- La web no puede garantizar que la Release esté publicada: prueba el botón después de cada cambio.

## Publicar los cambios en GitHub Pages
Sube el contenido de esta carpeta (`site/`) a la rama `main` del repositorio `R-R-SoftTech`
(Add file → Upload files, o `git add . && git commit && git push`). Pages se actualiza en 1-2 minutos.
Si algo no cambia en tu navegador, recarga con Ctrl+F5 (el service worker guarda copias; la versión de caché es `rr-softtech-v2`).

## Licencia del programa (importante para el mensaje comercial)
Valora no funciona sin una clave de licencia ligada al ID del equipo (la genera `generador_licencias.py`).
Por eso la descarga puede ser pública: cada cliente debe pedir su clave (prueba de 7 días o licencia).
Revisa que el texto «pago único / sin cuotas recurrentes» de la web sea coherente con el programa: `licencia.py` emite
claves por un número de días (365 por defecto) y muestra «Tu licencia anual venció. Solicita la renovación.»

