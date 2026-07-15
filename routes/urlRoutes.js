const express = require("express");
const {
    shortenUrl,
    createQrCode,
    redirectToOriginalUrl
} = require("../controllers/urlController");

const router = express.Router();

router.post("/shorten", shortenUrl);
router.post("/qr", createQrCode);
router.get("/:shortCode", redirectToOriginalUrl);

module.exports = router;
