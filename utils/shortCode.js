const crypto = require("crypto");

function generateShortCode(length = 6) {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let shortCode = "";

    for (let i = 0; i < length; i++) {
        shortCode += characters[crypto.randomInt(characters.length)];
    }

    return shortCode;
}

async function createUniqueShortCode(conn) {
    for (let attempt = 0; attempt < 5; attempt++) {
        const shortCode = generateShortCode();
        const rows = await conn.query(
            `
            SELECT id
            FROM urls
            WHERE short_code = ?
            LIMIT 1
            `,
            [shortCode]
        );

        if (rows.length === 0) {
            return shortCode;
        }
    }

    throw new Error("Could not generate a unique short code");
}

module.exports = {
    generateShortCode,
    createUniqueShortCode
};
