# Shawtly — URL Shortener

A simple full-stack URL shortener with QR code generation, built with Express and MariaDB.

## Features

- Shorten any valid URL to a random 6-character code
- Reuses existing short codes for URLs that were already shortened (dedupes)
- Generate a QR code for any shortened URL
- Copy shortened URL to clipboard
- Share shortened URL via the native OS share sheet (WhatsApp, X, Threads, etc.), with link-based fallback on desktop browsers
- Click tracking on redirects
- Auto-adds `https://` if the user forgets the protocol

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MariaDB
- **Frontend:** Vanilla HTML/CSS/JS
- **QR Generation:** `qrcode` npm package

## Project Structure

```
.
├── config/
│   └── db.js              # MariaDB connection pool
├── controllers/
│   └── urlController.js   # shorten / QR / redirect logic
├── routes/
│   └── urlRoutes.js       # route definitions
├── utils/
│   ├── shortCode.js       # short code generation
│   └── urlUtils.js        # URL normalization + base URL helper
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── server.js               # app entry point
└── .env                     # environment variables (not committed)
```

## Setup

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/rahulshaik25/<repo-name>.git
   cd <repo-name>
   npm install
   ```

2. Create a `.env` file in the root:
   ```
   PORT=5000
   BASE_URL=http://localhost:5000
   DB_HOST=localhost
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   ```

3. Create the `urls` table:
   ```sql
   CREATE TABLE urls (
       id INT AUTO_INCREMENT PRIMARY KEY,
       original_url VARCHAR(2048) NOT NULL,
       short_code VARCHAR(10) NOT NULL UNIQUE,
       click_count INT DEFAULT 0,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. Run the server:
   ```bash
   node server.js
   ```
   Visit `http://localhost:5000`.

## Notes

- The Share and Copy buttons rely on `navigator.share()` / `navigator.clipboard`, both of which require a secure context (HTTPS, or `localhost`). They won't work over plain `http://` on a local network IP — this resolves automatically once deployed.

## How It Works

**Shortening a URL**
1. Frontend (`script.js`) sends the entered URL to `POST /shorten`.
2. `urlUtils.js` normalizes it (adds `https://` if missing, validates protocol/hostname).
3. Controller checks the `urls` table — if this URL was already shortened, it reuses the existing short code instead of creating a duplicate.
4. If it's new, `shortCode.js` generates a random 6-character code, checks the DB to make sure it's not already taken (retries if it is), and it gets inserted alongside the original URL.
5. The full short link is returned and displayed on the page.

**Redirecting**
`GET /:shortCode` looks up the matching original URL, increments its click count, then redirects the visitor there. This route is what actually gets hit whenever someone opens a shortened link — separate from the app's own frontend.

**QR Code**
The currently displayed short link is sent to `POST /qr`, which runs it through the `qrcode` package to generate a base64 PNG, returned and rendered directly as an `<img>`.

**Share / Copy**
Both use browser-native APIs (`navigator.share()` and `navigator.clipboard`) on the currently displayed short link — no server round-trip involved. These require HTTPS to work (see Notes below).

```
Frontend (script.js)
      │
      ▼
urlRoutes.js  ──▶  urlController.js  ──▶  urlUtils.js / shortCode.js
 (dispatch)         (orchestration)         (validation / code gen)
                            │
                            ▼
                      config/db.js (MariaDB pool)
```

## API Endpoints

| Method | Endpoint       | Body                          | Description                          |
|--------|----------------|--------------------------------|---------------------------------------|
| POST   | `/shorten`     | `{ "url": "..." }`            | Returns `{ shortUrl }`                |
| POST   | `/qr`          | `{ "shortUrl": "..." }`       | Returns `{ qrImage }` (base64 PNG)    |
| GET    | `/:shortCode`  | —                              | Redirects to the original URL         |

## License

Shaikrahul
