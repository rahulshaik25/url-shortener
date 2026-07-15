const QRCode = require("qrcode");
const pool = require("../config/db");

async function shortenUrl(req, res) {
    let conn;

    try {
        let { url } = req.body;

        if (!url || url.trim() === "") {
            return res.status(400).json({
                error: "URL is required"
            });
        }

        url = url.trim();

        if (!/^https?:\/\//i.test(url)) {
            url = "https://" + url;
        }

        try {
            new URL(url);
        } catch {
            return res.status(400).json({
                error: "Invalid URL"
            });
        }

        const shortCode = Math.random().toString(36).substring(2, 8);

        conn = await pool.getConnection();

        await conn.query(
            `
            INSERT INTO urls (original_url, short_code)
            VALUES (?, ?)
            `,
            [url, shortCode]
        );

        res.json({
            shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`
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
