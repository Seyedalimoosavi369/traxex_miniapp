function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
    document.getElementById(pageId).classList.add('active');
    document.getElementById(pageId).style.display = 'block';
}

function renderNetwork() {
    // این همان بخشی است که در صفحه Network نمایش داده می‌شود
    document.getElementById('tree-container').innerHTML = `
        <div class="binary-tree">
            <div class="node-root">YOU</div>
            <div class="branches">
                <div class="branch">Left: 62</div>
                <div class="branch">Right: 63</div>
            </div>
        </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
    showPage('home');
    renderNetwork(); // فراخوانی برای پر شدن صفحه Network
});
