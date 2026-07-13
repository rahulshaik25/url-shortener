const express = require("express");
const app = express();
const port = 5000;
const urls = {};

app.use(express.json());
app.use(express.static("public"));

app.post("/shorten", (req, res) => {
    const longUrl = req.body.url;
    const shortCode = Math.random().toString(36).substring(2, 8);

    urls[shortCode] = longUrl;

    res.json({
        shortUrl: `http://localhost:${port}/${shortCode}`
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



