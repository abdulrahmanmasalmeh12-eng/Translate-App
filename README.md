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

Deploy as a website on Render
-----------------------------

This repository includes a Render Blueprint. In Render, choose **New** > **Blueprint**, connect this repository, and deploy. Render runs `npm run build:web` and publishes the `render-site` folder.

The deployed site is an installable Progressive Web App (PWA). Open its HTTPS URL in a supported browser and use the browser's **Install app** option; on iPhone or iPad, use Safari's **Add to Home Screen** action.

The deployed website does not include `config.json`. Do not put private API tokens in files served to browsers; browser-side configuration is visible to visitors. The web app runs with its built-in defaults unless you add a backend for secret-backed AI services.

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
- Saving downloads the PDF or opens the browser's save dialog when supported.
- Authentication is demo (localStorage); use Firebase for production.
