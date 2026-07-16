const mariadb = require("mariadb");
const fs = require("fs");
const path = require("path");

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        ca: fs.readFileSync(path.join(__dirname, "ca.pem"), "utf8")
    },

    connectionLimit: 5
});

module.exports = pool;