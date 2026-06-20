function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
    document.getElementById(pageId).classList.add('active');
    document.getElementById(pageId).style.display = 'block';
}

function loadData() {
    const balance = localStorage.getItem('trx_balance') || 0;
    const left = localStorage.getItem('left_count') || 0;
    const right = localStorage.getItem('right_count') || 0;
    
    document.getElementById('balance').innerText = parseFloat(balance).toFixed(2);
    document.getElementById('mining-val').innerText = parseFloat(balance).toFixed(2);
    document.getElementById('tree-container').innerHTML = `
        <div class="binary-tree">
            <div class="node-root">YOU</div>
            <div class="branches">
                <div class="branch">Left: ${left}</div>
                <div class="branch">Right: ${right}</div>
            </div>
        </div>`;
}

function mine() {
    let balance = parseFloat(localStorage.getItem('trx_balance')) || 0;
    balance += 0.01;
    localStorage.setItem('trx_balance', balance);
    loadData();
}

document.addEventListener("DOMContentLoaded", () => {
    loadData();
    showPage('home');
});
