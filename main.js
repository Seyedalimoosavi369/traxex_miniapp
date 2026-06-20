const miners = [
    { name: "Basic Miner", price: 10, img: "assets/basic.png" },
    { name: "Pro Miner", price: 90, img: "assets/pro.png" }
];

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
    document.getElementById(pageId).classList.add('active');
    document.getElementById(pageId).style.display = 'block';
}

function init() {
    if (!localStorage.getItem('user_id')) {
        localStorage.setItem('user_id', Math.floor(Math.random() * 9000000) + 1000000);
        localStorage.setItem('trx_balance', 0);
        localStorage.setItem('left_count', 0);
        localStorage.setItem('right_count', 0);
    }
    
    document.getElementById('user-id').innerText = localStorage.getItem('user_id');
    document.getElementById('ref-link').value = "https://t.me/TraxBot?start=" + localStorage.getItem('user_id');
    
    const shopDiv = document.getElementById('shop-items');
    miners.forEach(m => {
        shopDiv.innerHTML += `
            <div class="shop-card">
                <img src="${m.img}" onerror="this.src='https://via.placeholder.com/50'">
                <div><h4>${m.name}</h4><p>Price: ${m.price} TRX</p></div>
            </div>`;
    });
    updateUI();
}

function updateUI() {
    const bal = parseFloat(localStorage.getItem('trx_balance') || 0);
    document.getElementById('balance').innerText = bal.toFixed(2);
    document.getElementById('mining-val').innerText = bal.toFixed(2);
    document.getElementById('wallet-balance').innerText = bal.toFixed(2) + " TRX";
    document.getElementById('tree-container').innerHTML = `
        <div class="binary-tree">
            <div class="node-root">YOU</div>
            <div class="branches">
                <div class="branch">Left: ${localStorage.getItem('left_count')}</div>
                <div class="branch">Right: ${localStorage.getItem('right_count')}</div>
            </div>
        </div>`;
}

function mine() {
    let bal = parseFloat(localStorage.getItem('trx_balance') || 0);
    bal += 0.01;
    localStorage.setItem('trx_balance', bal);
    updateUI();
}

document.addEventListener("DOMContentLoaded", init);
