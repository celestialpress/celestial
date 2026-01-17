// lmao ion feel like making this support modules so imma just import and change
// mind change
const pr0xySelect = document.getElementById('pr0xySelect');
const transportsele = document.getElementById('tselect');

pr0xySelect.addEventListener('change', () => {
    localStorage.setItem('pr0xy', pr0xySelect.value);
    location.reload();
});

transportsele.addEventListener('change', () => {
    localStorage.setItem('transportz', transportsele.value);
    location.reload();
});

window.addEventListener('DOMContentLoaded', () => {
    const savedProxy = localStorage.getItem('pr0xy');
    if (savedProxy && [...pr0xySelect.options].some(opt => opt.value === savedProxy)) {
        pr0xySelect.value = savedProxy;
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const savedTransport = localStorage.getItem('transportz');
    if (savedTransport && [...transportsele.options].some(opt => opt.value === savedTransport)) {
        transportsele.value = savedTransport;
    }
});
