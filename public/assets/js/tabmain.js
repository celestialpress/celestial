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
const foot = document.querySelector('.footer .a2');
const foot2 = document.querySelector('.footer .a3');

 h1.textContent = "celestial.";
 url.placeholder = "search with ease";
 card.querySelector('p').innerHTML = "ga<span>m</span>es";
 card2.querySelector('p').textContent = "chat";
 card3.querySelector('p').textContent = "media";
 // i know this is stupid but it looks really ugly when looking in the code so im doing this
 foot.innerHTML = "dis<span>c</span>ord s<span>er</span>v<span>e</span>r";
 foot.href = "https://dsc.gg/gnetwork";
 foot.target = "_blank"
 foot2.textContent = "legal";
