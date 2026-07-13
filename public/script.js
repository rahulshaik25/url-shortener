const cpy = document.getElementById("copy");

cpy.addEventListener("click",()=>
{
    alert("The link is getting copied");
});

const qr = document.getElementById("qr");

qr.addEventListener("click",()=>
{
    alert("The QR is getting generated");
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
