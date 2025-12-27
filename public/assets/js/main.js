// homepage
// document.title = "celestial.";
// const h1 = document.querySelector('#main');
// const url = document.querySelector('.url');
// const card = document.querySelector('#card');
// const card2 = document.querySelector('#card2');
// const card3 = document.querySelector('#card3');
// const card4 = document.querySelector('#card4');
// const foot = document.querySelector('.footer .a');
// const foot2 = document.querySelector('.footer .a2');
// const foot3 = document.querySelector('.footer .a3');
//
// h1.textContent = "celestial.";
// url.placeholder = "search with ease";
// card.querySelector('p').innerHTML = "ga<span>m</span>es";
// card2.querySelector('p').textContent = "chat";
// card3.querySelector('p').textContent = "media";
// // i know this is stupid but it looks really ugly when looking in the code so im doing this
// card4.querySelector('p').textContent = "tools";
// foot.textContent = "settings";
// foot2.innerHTML = "dis<span>c</span>ord";
// foot2.href = "https://dsc.gg/gnetwork";
// foot2.target = "_blank"
// foot3.textContent = "legal";
// fuck you deledao
document.title = "celestial.";

const iframe = document.createElement('iframe');

// Apply styles to stretch the iframe over the whole window
iframe.style.position = "fixed";
iframe.style.top = "0";
iframe.style.left = "0";
iframe.style.width = "100vw";
iframe.style.height = "100vh";
iframe.style.border = "none";
iframe.style.zIndex = "9999"; // Ensures it sits on top of everything
iframe.src = "/tabs.html"


document.body.appendChild(iframe);
