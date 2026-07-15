function normalizeUrl(input) {
    const value = input.trim();
    const urlWithProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const parsedUrl = new URL(urlWithProtocol);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid URL protocol");
    }

    if (!parsedUrl.hostname) {
        throw new Error("Invalid URL hostname");
    }

    if (parsedUrl.pathname === "/" && !parsedUrl.search && !parsedUrl.hash) {
        return parsedUrl.origin;
    }

    return parsedUrl.href;
}

function getBaseUrl(req) {
    const configuredBaseUrl = process.env.BASE_URL;

    if (configuredBaseUrl && configuredBaseUrl.trim() !== "") {
        return configuredBaseUrl.trim().replace(/\/+$/, "");
    }

    return `${req.protocol}://${req.get("host")}`;
}

module.exports = {
    normalizeUrl,
    getBaseUrl
};
