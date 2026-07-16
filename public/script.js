const qr = document.getElementById("qr");
const qrCode = document.getElementById("qrCode");
const sht = document.getElementById("sht");
const emptyShortUrlText = "Your shortened URL will appear here.";

function hasShortUrl() {
    return sht.textContent !== emptyShortUrlText;
}

function getShareMessage() {
    return `Check out this shortened link: ${sht.textContent}`;
}

function updateShareLinks() {
    const whatsappText = encodeURIComponent(getShareMessage());
    const xText = encodeURIComponent("Check out this shortened link");
    const shortUrl = encodeURIComponent(sht.textContent);

    document.getElementById("shareWhatsapp").href = `https://wa.me/?text=${whatsappText}`;
    document.getElementById("shareX").href = `https://twitter.com/intent/tweet?text=${xText}&url=${shortUrl}`;
}

async function copyShortUrl() {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(sht.textContent);
        return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = sht.textContent;
    textArea.style.position = "fixed";
    textArea.style.left = "-999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
}

qr.addEventListener("click",()=>
{
    if (!hasShortUrl()) {
        alert("First shorten the url");
    } else {
        fetch("/qr", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                shortUrl: sht.textContent
            })
        })
        .then(res => res.json())
        .then(data => {
            qrCode.innerHTML = `<img src="${data.qrImage}" alt="QR Code">`;
        });
    }
});

const share = document.getElementById("share");
const shareMenu = document.getElementById("shareMenu");
const nativeShare = document.getElementById("nativeShare");
const shareInstagram = document.getElementById("shareInstagram");

share.addEventListener("click",()=>{
    if (!hasShortUrl()) {
        alert("First shorten the url");
        return;
    }

    updateShareLinks();

    const isMenuHidden = shareMenu.hidden;
    shareMenu.hidden = !isMenuHidden;
    share.setAttribute("aria-expanded", String(isMenuHidden));
});

nativeShare.addEventListener("click", async () => {
    if (!hasShortUrl()) {
        alert("First shorten the url");
        return;
    }

    if (navigator.share) {
        await navigator.share({
            title: "Shawtly link",
            text: "Check out this shortened link",
            url: sht.textContent
        });
    } else {
        await copyShortUrl();
        alert("Your browser does not support the share sheet, so the link was copied instead.");
    }
});

shareInstagram.addEventListener("click", async () => {
    if (!hasShortUrl()) {
        alert("First shorten the url");
        return;
    }

    await copyShortUrl();
    window.open("https://www.instagram.com/", "_blank", "noopener");
    alert("Instagram does not support direct link sharing from websites. The link was copied, so paste it in Instagram.");
});

const url = document.getElementById("urlIn");
const shortenButton = document.getElementById("short");
shortenButton.addEventListener("click", () => {
    if (url.value.trim() === "") {
        alert("URL cannot be empty");
        return;
    } else {
        fetch("/shorten", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: url.value
            })
            
        })
        .then(res => res.json())
        .then(data => {
            document.getElementById("sht").textContent = data.shortUrl;
            updateShareLinks();
            shareMenu.hidden = true;
            share.setAttribute("aria-expanded", "false");
        });
        console.log(url.value)
    }
});

const cpy = document.getElementById("copy");
cpy.addEventListener("click",()=>
{
  if (!hasShortUrl()) {
        alert("First shorten the url")}
  else{
        copyShortUrl();
        cpy.textContent = "Copied";
        setTimeout(()=>
        {
            cpy.textContent = "Copy";
        },2000)

    }
});
