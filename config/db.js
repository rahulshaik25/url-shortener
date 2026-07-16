const mariadb = require("mariadb");
const fs = require("fs");
const path = require("path");

const config = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
};

if (process.env.DB_HOST !== "localhost") {
    config.ssl = {
        ca: fs.readFileSync(path.join(__dirname, "ca.pem"), "utf8")
    };
}

const pool = mariadb.createPool(config);

module.exports = pool;
