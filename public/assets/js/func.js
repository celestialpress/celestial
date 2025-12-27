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

function inspect() {
  const frame = document.querySelector('iframe[id^="frame-"]');
  if (!frame) return alert('No frame found.');

  try {
    const doc = frame.contentWindow.document;
    const s = doc.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/eruda';
    doc.body.appendChild(s);
  } catch {
    alert('Cross-origin frame, cannot inject.');
  }
}
