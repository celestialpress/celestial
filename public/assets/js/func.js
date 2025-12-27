// self-explanitory
function reload() {
  var iframe = document.querySelector('iframe')
  iframe.contentWindow.location.reload()
}

function back() {
  var iframe = document.querySelector('iframe')
  iframe.contentWindow.history.back()
}

function forward() {
  var iframe = document.querySelector('iframe')
  iframe.contentWindow.history.forward()
}

// inspector gadget
// see what i did there
// you're permitted to laugh
function inspect() {
  const f = document.querySelector('iframe[id^="frame-"]');
  if (!f) return alert('No frame found.');
  try {
    // load and show console
    const d = f.contentWindow.document;
    const s = d.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/eruda';
    s.onload = () => (f.contentWindow.eruda.init(), f.contentWindow.eruda.show());
    // kidnap my child 🤑
    d.body.appendChild(s);
  } catch {
    alert('Cross-origin frame, cannot inject.');
  }
}
