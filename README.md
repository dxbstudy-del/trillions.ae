# Trillions.ae Website

This repository contains the first production-ready static website package for `trillions.ae`.

## Main files

- `index.html` — homepage
- `about.html` — company profile
- `services.html` — sourcing and trading services
- `products.html` — product focus areas
- `contact.html` — inquiry form using mailto
- `assistant.html` — AI assistant page
- `privacy.html` — starter privacy policy
- `terms.html` — starter terms page
- `assets/css/styles.css` — website styling
- `assets/js/main.js` — navigation, contact form, chat front-end
- `api/chat.php` — server-side OpenAI chat endpoint

## DirectAdmin deployment

In DirectAdmin Git Manager, use:

```text
Deploy Branch: main
Deploy Directory: domains/trillions.ae/public_html
```

Then run:

```text
Fetch → Pull → Deploy
```

## AI assistant configuration

The browser never stores the OpenAI API key. The website calls:

```text
/api/chat.php
```

Preferred server setting:

```text
OPENAI_API_KEY=your_api_key_here
```

Shared-hosting fallback if environment variables are not available:

1. In DirectAdmin File Manager, go to `domains/trillions.ae`.
2. Create a folder named `private` next to `public_html`, not inside `public_html`.
3. Create this file: `domains/trillions.ae/private/openai.php`.
4. Put this content in the file:

```php
<?php
return [
    'OPENAI_API_KEY' => 'paste_your_openai_api_key_here',
];
```

5. Save the file, then test `https://trillions.ae/assistant.html`.

Do not commit API keys to this repository. Do not place the key in any HTML, JavaScript, CSS, or public file.

## Notes

- The current contact email is `info@trillions.ae` in `assets/js/main.js`.
- The legal pages are starter templates and should be reviewed before commercial launch.
- If the official legal brand spelling is `Triilions`, update text and logo labels across the HTML files.
