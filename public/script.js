const qr = document.getElementById("qr");
const qrCode = document.getElementById("qrCode");
const sht = document.getElementById("sht");

qr.addEventListener("click",()=>
{
    if (sht.textContent === "Your shortened URL will appear here.") {
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
share.addEventListener("click",()=>{
    alert("Select the application you wnanna share son ");
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
        });
        console.log(url.value)
    }
});

const cpy = document.getElementById("copy");
cpy.addEventListener("click",()=>
{
  if (sht.textContent === "Your shortened URL will appear here.") {
        alert("First shorten the url")}
  else{
        navigator.clipboard.writeText(sht.textContent)
        cpy.textContent = "Copied";
        setTimeout(()=>
        {
            cpy.textContent = "Copy";
        },2000)

    }
});
