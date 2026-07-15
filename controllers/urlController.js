const QRCode = require("qrcode");
const pool = require("../config/db");
const { normalizeUrl, getBaseUrl } = require("../utils/urlUtils");
const { createUniqueShortCode } = require("../utils/shortCode");

async function shortenUrl(req, res) {
    let conn;

    try {
        let { url } = req.body;

        if (!url || url.trim() === "") {
            return res.status(400).json({
                error: "URL is required"
            });
        }

        try {
            url = normalizeUrl(url);
        } catch {
            return res.status(400).json({
                error: "Invalid URL"
            });
        }

        conn = await pool.getConnection();

        // Flow: check database first, reuse existing short code if this URL was already shortened.
        const existingRows = await conn.query(
            `
            SELECT short_code
            FROM urls
            WHERE original_url = ?
            LIMIT 1
            `,
            [url]
        );

        if (existingRows.length > 0) {
            return res.json({
                shortUrl: `${getBaseUrl(req)}/${existingRows[0].short_code}`
            });
        }

        const shortCode = await createUniqueShortCode(conn);

        await conn.query(
            `
            INSERT INTO urls (original_url, short_code)
            VALUES (?, ?)
            `,
            [url, shortCode]
        );

        res.json({
            shortUrl: `${getBaseUrl(req)}/${shortCode}`
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Internal Server Error"
        });

    } finally {
        if (conn) conn.release();
    }
}

async function createQrCode(req, res) {
    try {
        const shortUrl = req.body.shortUrl;

        if (!shortUrl) {
            return res.status(400).json({
                message: "Short URL is required"
            });
        }

        const qrImage = await QRCode.toDataURL(shortUrl);

        res.json({
            qrImage
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Internal Server Error"
        });
    }
}

async function redirectToOriginalUrl(req, res) {
    let conn;

    try {
        const shortCode = req.params.shortCode;

        conn = await pool.getConnection();

        const rows = await conn.query(
            `
            SELECT original_url
            FROM urls
            WHERE short_code = ?
            LIMIT 1
            `,
            [shortCode]
        );

        if (rows.length === 0) {
            return res.status(404).send("Short URL not found");
        }

        await conn.query(
            `
            UPDATE urls
            SET click_count = COALESCE(click_count, 0) + 1
            WHERE short_code = ?
            `,
            [shortCode]
        );

        res.redirect(rows[0].original_url);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "Internal Server Error"
        });
    } finally {
        if (conn) conn.release();
    }
}

module.exports = {
    shortenUrl,
    createQrCode,
    redirectToOriginalUrl
};
