const state = {
    balance: 10235456,
    userId: "123456789",
    rankings: [
        {name: "Mohsen", val: "2.5B TRX"},
        {name: "Amir", val: "1.8B TRX"},
        {name: "Reza", val: "1.2B TRX"}
    ],
    items: [
        {name: "Pickaxe", price: "4 TON", power: "+600 TRX/h"},
        {name: "Energy Cell", price: "2 TON", power: "+200 TRX/h"},
        {name: "Auto Miner", price: "5 TON", power: "+1000 TRX/h"}
    ]
};

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    renderPage(pageId);
}

function renderPage(pageId) {
    if(pageId === 'shop') {
        const shop = document.getElementById('shop-items');
        shop.innerHTML = state.items.map(i => `
            <div class="shop-card">
                <div><h4>${i.name}</h4><p>${i.power}</p></div>
                <button onclick="alert('Purchased ${i.name}')">${i.price}</button>
            </div>`).join('');
    }
    if(pageId === 'rankings') {
        const lead = document.getElementById('leaderboard');
        lead.innerHTML = state.rankings.map((r, idx) => `
            <div class="rank-card"><span>${idx+1}</span> ${r.name} <b>${r.val}</b></div>`).join('');
    }
}

function mine() {
    state.balance += 0.01;
    document.getElementById('balance').innerText = state.balance.toFixed(2);
}

// مقداردهی اولیه
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('user-id').innerText = state.userId;
    document.getElementById('ref-link').value = "https://t.me/TraxBot?start=" + state.userId;
    document.getElementById('balance').innerText = state.balance;
});
