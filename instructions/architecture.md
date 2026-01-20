# Architektur

- Server rendert HTML als Standardantwort.
- HTMX liefert Interaktivität, kein SPA-Verhalten.
- Backend besitzt den Zustand, der Client ist stateless.
- Seiten sind einfach, klein, zusammensetzbar.
- Keine Frontend-State-Libraries.
- UI-Updates: nur HTML-Fragmente, kein JSON für UI.
