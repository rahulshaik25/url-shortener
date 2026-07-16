# Shawtly — URL Shortener

A simple full-stack URL shortener with QR code generation, built with Express and MariaDB.

## Features

- Shorten any valid URL to a random 6-character code
- Reuses existing short codes for URLs that were already shortened (dedupes)
- Generate a QR code for any shortened URL
- Copy shortened URL to clipboard
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
   git clone https://github.com/rahulshaik25/url-shortener.git
   cd url-shortener
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

## API Endpoints

| Method | Endpoint       | Body                          | Description                          |
|--------|----------------|--------------------------------|---------------------------------------|
| POST   | `/shorten`     | `{ "url": "..." }`            | Returns `{ shortUrl }`                |
| POST   | `/qr`          | `{ "shortUrl": "..." }`       | Returns `{ qrImage }` (base64 PNG)    |
| GET    | `/:shortCode`  | —                              | Redirects to the original URL         |

## License

© 2026 Rahul Shaik. All rights reserved.
