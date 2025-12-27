import {
	setWisp,
	makeURL,
	getProxied,
	setTransport,
	setProxy,
} from "/lithium.mjs"




// new tab
// homepage
document.title = "new tab.";
const h1 = document.querySelector('#main');
const url = document.querySelector('.url');
const card = document.querySelector('#card');
const card2 = document.querySelector('#card2');
const card3 = document.querySelector('#card3');
const card4 = document.querySelector('#card4');
const foot = document.querySelector('.footer .a');
const foot2 = document.querySelector('.footer .a2');
const foot3 = document.querySelector('.footer .a3');

 h1.textContent = "celestial.";
 url.placeholder = "search with ease";
 card.querySelector('p').innerHTML = "ga<span>m</span>es";
 card2.querySelector('p').textContent = "chat";
 card3.querySelector('p').textContent = "media";
 // i know this is stupid but it looks really ugly when looking in the code so im doing this
 card4.querySelector('p').textContent = "tools";
 foot.textContent = "settings";
 foot2.innerHTML = "dis<span>c</span>ord";
 foot2.href = "https://dsc.gg/gnetwork";
 foot2.target = "_blank"
 foot3.textContent = "legal";
