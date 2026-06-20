let left = 62; let right = 63; let balance = 12850.75;

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
    document.getElementById(pageId).classList.add('active');
    document.getElementById(pageId).style.display = 'block';
}

function mine() {
    balance += 0.01;
    document.getElementById('balance').innerText = balance.toFixed(2);
    localStorage.setItem('trx_balance', balance.toFixed(2));
}

function checkBinary() {
    if (left === right && [10, 50, 100, 500].includes(left)) {
        balance += (left * right);
        alert("پاداش تعادل باینری واریز شد!");
    }
}

function renderNetwork() {
    document.getElementById('tree-container').innerHTML = `
        <div class="binary-tree">
            <div class="node-root">YOU</div>
            <div class="branches">
                <div class="branch">Left: ${left}</div>
                <div class="branch">Right: ${right}</div>
            </div>
        </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
    showPage('home');
    renderNetwork();
    checkBinary();
});
