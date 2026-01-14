// kiss ching inc
// ad server thing
const host = "brillianceremisswhistled.com";

// banner config
globalThis.atOptions = {
	key: "",
	format: "iframe",
	height: 600,
	width: 160,
	params: {},
};

// global function to load ads
globalThis.loadAds = function(config) {
	const scripts = [];
	
	if (config.banner) {
		// set banner key
		globalThis.atOptions.key = config.banner;
		scripts.push(`//${host}/${config.banner}/invoke.js`);
	}
	
	if (config.native) {
		// create native banner container
		document.body.insertAdjacentHTML(
			"beforeend",
			`<div id="container-${config.native}"></div>`
		);
		scripts.push(`//${host}/${config.native}/invoke.js`);
	}
	
	// load scripts
	scripts.forEach((link) => {
		const script = document.createElement("script");
		script.src = link;
		// 2x money!
		document.body.appendChild(script);
		document.body.appendChild(script);
	});
};

// hook XHR and fetch to prevent redirects
const originalXHROpen = XMLHttpRequest.prototype.open;
const originalXHRSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.open = function(method, url, ...args) {
	this._url = url;
	return originalXHROpen.apply(this, [method, url, ...args]);
};

XMLHttpRequest.prototype.send = function(...args) {
    // check if domain is external
	const urlObj = new URL(this._url, window.location.href);
	if (urlObj.hostname !== window.location.hostname) {
		const originalOnReadyStateChange = this.onreadystatechange;
		this.onreadystatechange = function() {
			if (this.readyState == 4) {
				const status = this.status;
				if (status >= 300 && status < 400) {
					this.abort(); // ez
					return;
				}
			}
			if (originalOnReadyStateChange) {
				originalOnReadyStateChange.apply(this, arguments);
			}
		};
	}
	return originalXHRSend.apply(this, args);
};

// hide ads
setInterval(() => {
    // hide iframes pointing to about:blank
    document.querySelectorAll('iframe[src="about:blank"]').forEach((iframe) => {
        iframe.style.cssText = `
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
            position: absolute !important;
            width: 0 !important;
            height: 0 !important;
        `;
        iframe.removeAttribute('src');
        iframe.removeAttribute('onclick');
        iframe.removeAttribute('onmouseover');
        iframe.removeAttribute('onmouseenter');
        iframe.addEventListener('click', e => e.stopPropagation(), true);
    });

    // hide elements with adsterra container IDs
    document.querySelectorAll('[id]').forEach((el) => {
        if (/container-[a-zA-Z0-9]{8,}/i.test(el.id)) {
            el.style.cssText = `
                display: none !important;
                visibility: hidden !important;
                pointer-events: none !important;
                position: absolute !important;
                width: 0 !important;
                height: 0 !important;
            `;
            el.removeAttribute('href');
            el.removeAttribute('onclick');
            el.removeAttribute('onmousedown');
            el.addEventListener('click', e => e.preventDefault(), true);
        }
    });
}, 100);


// used for redirecting
const originalSetTimeout = window.setTimeout
window.setTimeout = function (fn, delay) {
	if (typeof fn === "function" && (delay == undefined || delay == null)) {
		const fnText = fn.toString()
		if (fnText.includes("href")) {
			return 0
		}
	}
	return originalSetTimeout.apply(this, arguments)
}