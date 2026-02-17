// custom userscripts aka extensions but the user can put their own yipee!!
import { currentFrame } from "/lithium.mjs";

window.addExt = addExt;
window.removeExt = removeExt;

function extList() {
  const list = document.getElementById('extList');
  list.innerHTML = '';
  const exts = JSON.parse(localStorage.getItem('customExts') || '[]');
  exts.forEach((ext, index) => {
    const item = document.createElement('div');
    item.className = 'extItem';
    const includesText = ext.includes === 'yes' ? 'yes' : 'no';
    const everywhereText = ext.includeEverywhere === 'yes' ? 'yes' : 'no';
    item.innerHTML = `<span>${ext.site || 'all sites'} (includes: ${includesText}, everywhere: ${everywhereText})</span>
                      <button onclick="removeExt(${index})">remove</button>`;
    list.appendChild(item);
  });
}

function addExt() {
  const code = document.getElementById('extCode').value.trim();
  const site = document.getElementById('siteInject').value.trim();
  const includeEverywhere = document.getElementById('includeEverywhere').checked ? 'yes' : 'no';
  const includes = document.getElementById('includesCheckbox').checked ? 'yes' : 'no';
  if (!code) return alert('code cannot be empty');

  const exts = JSON.parse(localStorage.getItem('customExts') || '[]');
  exts.push({ code, site, includeEverywhere, includes });
  localStorage.setItem('customExts', JSON.stringify(exts));

  document.getElementById('extCode').value = '';
  document.getElementById('siteInject').value = '';
  document.getElementById('includeEverywhere').checked = false;
  document.getElementById('includesCheckbox').checked = false;
  document.getElementById('siteInject').disabled = false;
  document.getElementById('siteInject').style.cursor = 'text';

  extList();
}

function removeExt(index) {
  const exts = JSON.parse(localStorage.getItem('customExts') || '[]');
  exts.splice(index, 1);
  localStorage.setItem('customExts', JSON.stringify(exts));
  extList();
}

const siteInput = document.getElementById('siteInject');
const includeEverywhere = document.getElementById('includeEverywhere');

includeEverywhere.addEventListener('change', () => {
  if (includeEverywhere.checked) {
    siteInput.value = ''; // CLEAR the URL input
  }
  siteInput.disabled = includeEverywhere.checked;
  siteInput.style.cursor = includeEverywhere.checked ? 'not-allowed' : 'text';
});

window.addEventListener('DOMContentLoaded', () => {
  extList();

  if (!currentFrame) return;

  currentFrame.addEventListener("load", () => {
    const url = currentFrame.dataset.displayUrl;
    const exts = JSON.parse(localStorage.getItem('customExts') || '[]');

    exts.forEach(e => {
      const sites = [].concat(e.site);

      let inject = false;
      if (e.includeEverywhere === 'yes') inject = true;
      else if (e.includes === 'yes') inject = sites.some(s => url.includes(s));
      else inject = sites.includes(new URL(url).hostname);

      if (inject && currentFrame.contentDocument) {
        const s = currentFrame.contentDocument.createElement("script");
        s.textContent = e.code;
        currentFrame.contentDocument.body.prepend(s);
      }
    });
  });
});
