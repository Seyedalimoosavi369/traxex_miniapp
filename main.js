// پاکسازی حافظه برای شروع از صفر مطلق (فقط برای بار اول)
if (!localStorage.getItem('initialized')) {
    localStorage.clear();
    localStorage.setItem('trx_balance', 0);
    localStorage.setItem('left_count', 0);
    localStorage.setItem('right_count', 0);
    localStorage.setItem('initialized', true);
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
    document.getElementById(pageId).classList.add('active');
    document.getElementById(pageId).style.display = 'block';
}

function updateUI() {
    const balance = parseFloat(localStorage.getItem('trx_balance'));
    const left = localStorage.getItem('left_count');
    const right = localStorage.getItem('right_count');

    // آپدیت هدر و ماینر
    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('mining-val').innerText = balance.toFixed(2);
    // آپدیت کیف پول
    document.getElementById('wallet-balance').innerText = balance.toFixed(2) + " TRX";
    // آپدیت شبکه
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
    let balance = parseFloat(localStorage.getItem('trx_balance'));
    balance += 0.01;
    localStorage.setItem('trx_balance', balance);
    updateUI();
}

document.addEventListener("DOMContentLoaded", () => {
    updateUI();
    showPage('home');
});
