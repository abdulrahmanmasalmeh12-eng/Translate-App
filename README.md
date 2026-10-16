Translate App
=============

A client-side demo web app that uses AI to analyze photos/documents, extract text, identify document type, translate to chosen language, save as PDF, and read aloud.

Run locally
---------

1. Install a static server if you don't have one (this uses `serve` via `npx`):

```bash
npx serve . --single
```

2. Open the printed URL in your browser (works on desktop and mobile browsers).

AI Features (Requires Hugging Face Token)
-----------------------------------------

The app uses AI for OCR, translation, and document identification. To enable:

1. Get a free Hugging Face token at https://huggingface.co/settings/tokens
2. Copy `config.example.json` to `config.json` and add your `huggingfaceToken`.
3. The app will use:
   - `microsoft/trocr-base-printed` for OCR (extract text from images)
   - `facebook/m2m100_418M` for translation (supports 100+ languages)
   - `facebook/bart-large-mnli` for document type classification (receipt, invoice, etc.)

Without the token, OCR falls back to Tesseract.js, and translation/AI features are disabled.

Notes
-----
- OCR powered by Tesseract.js (fallback) or AI (TrOCR).
- Translation uses AI (M2M100) or fallback to LibreTranslate if configured.
- Document identification uses AI to classify type.
- Saving prompts download; Electron supports direct save.
- Authentication is demo (localStorage); use Firebase for production.

Electron (desktop builds)
------------------------

To run the app as a desktop application with Electron (dev):

```bash
npm install --save-dev electron
npm run electron-start
```

To package builds (requires `electron-packager`):

```bash
npm install --save-dev electron-packager
npm run package:all
```

Note: Packaging and distribution steps may require platform-specific tools and signing certificates for macOS.
