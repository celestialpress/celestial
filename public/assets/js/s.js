// pre-const
const cloaktog = document.getElementById("cloakTog");

cloaktog.checked = localStorage.autoCloak === "1";

cloaktog.onchange = () => {
    localStorage.autoCloak = cloaktog.checked ? "1" : "0";
    if (cloaktog.checked) location.reload();
    location.reload();
};

const s = document.getElementById("cloakSelect");
s.value = localStorage.getItem("lastCloak") || "ab";
s.onchange = () => localStorage.setItem("lastCloak", s.value);


// settings

// showing the sections
function show(id) {
    const sections = ['cloak', 'browsing', 'appear', 'ext', 'misc'];

    sections.forEach(s => {
        document.getElementById(s).style.display = (s === id) ? 'block' : 'none';
    });
}

// secret theme
let t = "";
if (localStorage.getItem("theme"))
    document.body.setAttribute("theme", localStorage.getItem("theme"));

onkeydown = e => {
    if (document.activeElement.tagName !== "INPUT") {
        t += e.key.toLowerCase();
        if (t.endsWith("femlover")) {
            alert('you found an easter egg! creep')
            document.body.setAttribute("theme", "eww");
            localStorage.setItem("theme", "eww");
            t = "";
            location.reload();
        }
        if (t.endsWith("revert")) {
            document.body.setAttribute("theme", "default");
            localStorage.setItem("theme", "default");
            t = "";
            location.reload();
        }
        if (t.length > 20) t = t.slice(-20);
    }
};

// cloaking

// aboutblank, blob and aboutblank v2
function launch(v) {
    if (!v || v === "select") return;
    localStorage.setItem("lastCloak", v);
    let func;
    if (v === "blob") func = blob;
    if (v === "ab") func = ab;
    if (v === "abbuff") func = abbuff;
    if (!func) return;
    func();
    location.replace("https://google.com");
}

function launchCloak() {
    launch(document.getElementById("cloakSelect").value);
}

function autoCloak() {
    if (localStorage.autoCloak !== "1") return;
    const v = localStorage.lastCloak;
    if (v === "blob") blob();
    if (v === "ab") ab();
    if (v === "abbuff") abbuff();
}

function ab() {
    let inFrame;
    try { inFrame = window !== top; } catch { inFrame = true; }
    if (!inFrame && !navigator.userAgent.includes("Firefox")) {
        const popup = open("about:blank", "_blank");
        if (!popup || popup.closed) return;
        const doc = popup.document;
        const iframe = doc.createElement("iframe");
        const style = iframe.style;
        const link = doc.createElement("link");
        const name = localStorage.getItem("name") || "about:blank";
        const icon = localStorage.getItem("icon") || "https://example.com/favicon.ico";
        doc.title = name;
        link.rel = "icon";
        link.href = icon;
        iframe.src = location.href;
        style.position = "fixed";
        style.top = style.bottom = style.left = style.right = 0;
        style.border = style.outline = "none";
        style.width = style.height = "100%";
        doc.head.appendChild(link);
        doc.body.appendChild(iframe);
        location.replace("https://google.com");
    }
}

function blob() {
    const url = URL.createObjectURL(new Blob(
        [`<title>&#8203;</title><iframe src="https://${location.host}/index.html" style="position:fixed;inset:0;width:100%;height:100%;border:none"></iframe>`],
        { type: "text/html" }
    ));
    const win = window.open(url, "_blank");
    return win;
    location.replace("https://google.com");
}

function abbuff() {
    const myWindow1 = window.open("", "myWindow1", "scrollbars=1,height=" + screen.availHeight + ",width=" + screen.availWidth);
    if (!myWindow1 || myWindow1.closed) return;
    myWindow1.document.write(
        '<!DOCTYPE html>\n<title>about:blank</title><link rel="icon" href="https://ssl.gstatic.com/classroom/favicon.png"/><link rel="shortcut icon" href="https://ssl.gstatic.com/classroom/favicon.png"/>\n<p><iframe src="https://'+window.location.host+'" frameborder="0" style="overflow:hidden;height:100%;width:100%;position:absolute;top:0;left:0;right:0;bottom:0" height="100%" width="100%"></iframe>'
    );
    location.replace("https://google.com");
}

window.addEventListener("load", () => {
    if (localStorage.autoCloak === "1") autoCloak();
});

// tab cloak
// soon lmao

// extensions
// also soon

// misc
// also soon