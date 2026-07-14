const mysql = require("mysql2");
const express = require("express");
const QRCode = require("qrcode");
const app = express();
const port = 5000;
const urls = {};


app.use(express.json());
app.use(express.static("public"));
// const myconnection = mysql.createConnection({
//     host: "localhost",
//     user : "root",
//     password : "2004-Rahul",
//     database: "url_shortener"
// });

// myconnection.connect((err)=>{
//     if(err)
//     {
//         console.error("database connection failed",err);
//     }
//     console.log(" Connected to MariaDB!");
// })


app.post("/shorten", async (req, res) => {
    try {
        // Read and clean the URL sent by the frontend.
        let longUrl = req.body.url.trim();

        if (longUrl === "") {
            return res.status(400).json({
                message: "URL cannot be empty"
            });
        }

        // Add https:// when the user enters only a domain like amazon.in.
        if (!longUrl.startsWith("https://") && !longUrl.startsWith("http://")) {
            longUrl = `https://${longUrl}`;
        }

        // Validate URL syntax using JavaScript's built-in URL class.
        new URL(longUrl);

        // Check whether the destination website is reachable before shortening it.
        const response = await fetch(longUrl, {
            method: "HEAD"
        });

        if (!response.ok) {
            return res.status(400).json({
                message: "Website is unreachable"
            });
        }

        const shortCode = Math.random().toString(36).substring(2, 8);

        urls[shortCode] = longUrl;

        res.json({
            shortUrl: `http://localhost:${port}/${shortCode}`
        });
    } catch (err) {
        return res.status(400).json({
            message: "Invalid or unreachable URL"
        });
    }
});

app.post("/qr", async (req, res) => {
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
});

app.get("/:shortCode", (req, res) => {
    const shortCode = req.params.shortCode;
    const longUrl = urls[shortCode];

    if (longUrl) {
        res.redirect(longUrl);
    } else {
        res.status(404).send("Short URL not found");
    }
});

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})

