// دیتایِ آیتم‌های فروشگاه
const miners = [
    { name: "Basic Miner", power: 1, price: 10, img: "assets/basic.png" },
    { name: "Pro Miner", power: 12, price: 90, img: "assets/pro.png" }
];

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
    document.getElementById(pageId).classList.add('active');
    document.getElementById(pageId).style.display = 'block';
}

function initData() {
    // مقداردهی اولیه یوزر آیدی و لینک
    if (!localStorage.getItem('user_id')) {
        localStorage.setItem('user_id', Math.floor(Math.random() * 9000000) + 1000000);
        localStorage.setItem('trx_balance', 0);
    }
    
    document.getElementById('user-id').innerText = localStorage.getItem('user_id');
    document.getElementById('ref-link').value = "https://t.me/TraxBot?start=" + localStorage.getItem('user_id');
    
    // رندر فروشگاه
    const shopDiv = document.getElementById('shop-items');
    miners.forEach(m => {
        shopDiv.innerHTML += `
            <div class="shop-card">
                <img src="${m.img}" onerror="this.src='https://via.placeholder.com/50'">
                <div>
                    <h4>${m.name}</h4>
                    <p>Price: ${m.price} TRX</p>
                </div>
            </div>`;
    });
}

function mine() {
    let balance = parseFloat(localStorage.getItem('trx_balance')) || 0;
    balance += 0.01;
    localStorage.setItem('trx_balance', balance);
    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('mining-val').innerText = balance.toFixed(2);
    document.getElementById('wallet-balance').innerText = balance.toFixed(2) + " TRX";
}

document.addEventListener("DOMContentLoaded", () => {
    initData();
    showPage('home');
});
