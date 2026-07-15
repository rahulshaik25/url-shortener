require("dotenv").config();
const pool = require("./config/db");
const express = require("express");
const urlRoutes = require("./routes/urlRoutes");
const app = express();
const port = process.env.PORT || 5000;


app.set("trust proxy", true);
app.use(express.json());
app.use(express.static("public"));
app.use("/", urlRoutes);


async function testConnection() {
    let conn;

    try {
        conn = await pool.getConnection();
        console.log(" Connected to MariaDB");
        const rows = await conn.query("SHOW TABLES");
        console.log(rows);
        
    } catch (err) {
        console.error(" Database connection failed");
        console.error(err);
    } finally {
        if (conn) conn.release();
    }
}

testConnection();

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})
