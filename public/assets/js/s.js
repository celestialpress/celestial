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
        if (t.endsWith("gnmath")) {
            alert(`W gn-math ❤‍🩹`)
            document.body.setAttribute("theme", "chad");
            localStorage.setItem("theme", "chad");
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
    const w = open("about:blank", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><title>&#8203;</title><iframe src="https://${location.host}/index.html" style="position:fixed;inset:0;width:100%;height:100%;border:none"></iframe>`);
    location.replace("https://google.com");
}

function abbuff() {
    const w = open("about:blank", "_blank", `width=${screen.availWidth},height=${screen.availHeight}`);
    if (!w) return;

    w.document.write(`<!DOCTYPE html><title>about:blank</title><link rel="icon" href="https://ssl.gstatic.com/classroom/favicon.png"><style>html,body{margin:0;height:100%}</style><iframe src="https://${location.host}/index.html" style="position:fixed;inset:0;width:100%;height:100%;border:none"></iframe><script>if(!window.__done){window.__done=1;setTimeout(()=>opener.location.replace("https://google.com"),100)}<\/script>`);
}

window.addEventListener("load", () => {
    if (localStorage.autoCloak === "1") autoCloak();
});

// tab cloak
// stolen from jmw lite & rewritten
let initialTitle = 'celestial';
let initialFavicon = document.getElementById('favicon').href;

const presets = {
    google: { title: "Google", favicon: "https://www.google.com/favicon.ico" },
    khan: { title: "Khan Academy", favicon: "https://khanacademy.org/favicon.ico" },
    schoology: { title: "Schoology", favicon: "https://www.powerschool.com/favicon.ico" },
    gc: { title: "Home - Classroom", favicon: "https://ssl.gstatic.com/classroom/favicon.png" },
    clever: { title: "Clever | Portal", favicon: "https://clever.com/favicon.ico" },
    nt: { title: "New Tab", favicon: "/assets/img/logo.png" }
};

function applyCloak() {
    const title = document.getElementById('titleInput').value;
    const favicon = document.getElementById('faviconInput').value;
    if (title) document.title = title, localStorage.setItem('savedTitle', title);
    if (favicon) updateFavicon(favicon.startsWith('https://') ? favicon : 'https://' + favicon), localStorage.setItem('savedFavicon', favicon);
}

function resetCloak() {
    document.title = initialTitle;
    updateFavicon(initialFavicon);
    ['titleInput','faviconInput','tabCloak'].forEach(id => document.getElementById(id).value = '');
    localStorage.removeItem('savedTitle');
    localStorage.removeItem('savedFavicon');
}

function applyPreset() {
    const preset = presets[document.getElementById('tabCloak').value];
    if (preset) {
        document.getElementById('titleInput').value = preset.title;
        document.getElementById('faviconInput').value = preset.favicon;
        applyCloak();
    }
}

function updateFavicon(url) {
    const old = document.getElementById('favicon');
    if (old) old.remove();
    const link = document.createElement('link');
    link.id = 'favicon';
    link.rel = 'icon';
    link.href = url;
    document.head.appendChild(link);
}

document.addEventListener('DOMContentLoaded', () => {
    const title = localStorage.getItem('savedTitle');
    const favicon = localStorage.getItem('savedFavicon');
    if (title) document.title = title, document.getElementById('titleInput').value = title;
    if (favicon) updateFavicon(favicon), document.getElementById('faviconInput').value = favicon;
});
// switch cloak
var savedTitle = '';
var savedFavicon = '';
var toggle;

function updateFavicon(url) {
    var old = document.getElementById('favicon');
    if (old) old.remove();
    var link = document.createElement('link');
    link.id = 'favicon';
    link.rel = 'icon';
    link.href = url;
    document.head.appendChild(link);
}

function switchCloak() {
    if (document.hidden) {
        savedTitle = document.title;
        savedFavicon = document.getElementById('favicon') ? document.getElementById('favicon').href : '/assets/img/logo.png';

        var currentTitle = localStorage.getItem('savedTitle');
        var currentFavicon = localStorage.getItem('savedFavicon');

        if (currentTitle && currentFavicon) {
            document.title = currentTitle;
            updateFavicon(currentFavicon);
        } else {
            document.title = 'Google Slides';
            updateFavicon('https://ssl.gstatic.com/docs/presentations/images/favicon-2023q4.ico');
        }

        localStorage.setItem('switchCloakTitle', document.title);
        localStorage.setItem('switchCloakFavicon', document.querySelector('#favicon')?.href || '');
    } else {
        document.title = 'celestial.';
        updateFavicon('/assets/img/logo.png');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    toggle = document.getElementById('switchTog');
    if (!toggle) return;

    var stored = localStorage.getItem('switchCloakOn');
    if (stored === 'true') {
        toggle.checked = true;
        document.title = 'celestial.';
        updateFavicon('/assets/img/logo.png');
        document.addEventListener('visibilitychange', switchCloak);
    }

    toggle.onchange = function() {
        if (toggle.checked) {
            localStorage.setItem('switchCloakOn', 'true');
            document.title = 'celestial.';
            updateFavicon('/assets/img/logo.png');
            document.addEventListener('visibilitychange', switchCloak);
        } else {
            localStorage.setItem('switchCloakOn', 'false');
            document.removeEventListener('visibilitychange', switchCloak);
            document.title = localStorage.getItem('savedTitle') || 'celestial.';
            updateFavicon(localStorage.getItem('savedFavicon') || '/assets/img/logo.png');
        }
    };
});

// extensions
// will be in seperate module file, since it requires module-js because module.

// misc
// also soon