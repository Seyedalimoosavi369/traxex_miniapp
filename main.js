// دریافت وضعیت از LocalStorage
let state = JSON.parse(localStorage.getItem('game_state')) || { 
    items: shopConfig.items, 
    specials: shopConfig.specials,
    balanceTRX: 0, 
    balanceTON: 0,
    miningPower: 1,
    maxBank: 5000 
};

function buyItem(itemId, currency) {
    let item = state.items.find(i => i.id === itemId);
    let cost = (currency === 'TON') ? (item.baseTON * Math.pow(2, item.level)) : (item.baseTRX * Math.pow(2, item.level));
    
    if (checkBalance(cost, currency)) {
        item.level++;
        updateGlobalStats(item);
        checkUnlockConditions();
        saveState();
        renderShop();
    }
}

function updateGlobalStats(item) {
    state.miningPower *= 2; // دبل کردن قدرت ماین با خرید هر آیتم
    state.maxBank += 1000;   // افزایش ۱۰۰۰ تایی مخزن
}

function checkUnlockConditions() {
    let boughtItems = state.items.filter(i => i.level > 0).length;
    if (boughtItems >= 6) state.specials.rexar.unlocked = true;
    if (boughtItems >= 12) state.specials.soulKeeper.unlocked = true;
    
    if (state.specials.rexar.level >= 3 && state.specials.soulKeeper.level >= 3) {
        state.specials.zeus.unlocked = true;
    }
}

function renderShop() {
    const shopDiv = document.getElementById('shop-items');
    shopDiv.innerHTML = state.items.map(i => `
        <div class="shop-item ${i.level === 0 ? 'locked' : ''}">
            <img src="assets/item${i.id}.png">
            <h3>${i.name} (Lvl ${i.level})</h3>
            <button onclick="buyItem(${i.id}, 'TRX')">TRX: ${i.baseTRX * Math.pow(2, i.level)}</button>
            <button onclick="buyItem(${i.id}, 'TON')">TON: ${i.baseTON * Math.pow(2, i.level)}</button>
        </div>
    `).join('');
    // اینجا باید منطق نمایش Rexar و بقیه را هم اضافه کنید
}
