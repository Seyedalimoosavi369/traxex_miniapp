// ۱. لیستِ کاملِ ۱۲ آیتم
const shopItems = [
    { id: 1, name: "Iron Pickaxe" }, { id: 2, name: "Bronze Drill" }, { id: 3, name: "Silver Chisel" },
    { id: 4, name: "Gold Hammer" }, { id: 5, name: "Platinum Blade" }, { id: 6, name: "Diamond Cutter" },
    { id: 7, name: "Titanium Axe" }, { id: 8, name: "Ruby Saw" }, { id: 9, name: "Emerald Shovel" },
    { id: 10, name: "Sapphire Pick" }, { id: 11, name: "Obsidian Maul" }, { id: 12, name: "Void Breaker" }
];

// ۲. وضعیتِ برنامه
let game = JSON.parse(localStorage.getItem('gameData')) || {
    items: shopItems.map(i => ({ ...i, level: 0, priceTRX: 1000, priceTON: 1 })),
    rexar: { level: 0, unlocked: false, priceTON: 10 },
    soul: { level: 0, unlocked: false, priceTON: 10 },
    zeus: { level: 0, unlocked: false, priceTON: 100 },
    balanceTRX: 0,
    balanceTON: 0
};

// ۳. تابعِ خرید (با قانونِ ضرب در ۲)
function buyItem(type, id, currency) {
    let target = (type === 'normal') ? game.items.find(i => i.id === id) : game[type];
    let cost = (currency === 'TON') ? target.priceTON : target.priceTRX;

    // کسر پول و ارتقا
    target.level++;
    if (currency === 'TON') target.priceTON *= 2;
    else if (target.priceTRX) target.priceTRX *= 2;

    // منطقِ باز شدنِ ویژه
    let boughtCount = game.items.filter(i => i.level > 0).length;
    if (boughtCount >= 6) game.rexar.unlocked = true;
    if (boughtCount >= 12) game.soul.unlocked = true;
    if (game.rexar.level >= 3 && game.soul.level >= 3) game.zeus.unlocked = true;

    save();
}

// ۴. رندرِ فروشگاه (با عکس‌هایِ png شما)
function renderShop() {
    const container = document.getElementById('shop-items');
    container.innerHTML = `
        <div class="shop-grid">
            ${game.items.map(i => `
                <div class="card ${i.level == 0 ? 'locked' : ''}">
                    <img src="assets/item${i.id}.png">
                    <h3>${i.name}</h3>
                    <button onclick="buyItem('normal', ${i.id}, 'TRX')">TRX: ${i.priceTRX}</button>
                    <button onclick="buyItem('normal', ${i.id}, 'TON')">TON: ${i.priceTON}</button>
                </div>
            `).join('')}
            
            ${game.rexar.unlocked ? `
                <div class="card">
                    <img src="assets/rexar.png">
                    <h3>Rexar (Lvl ${game.rexar.level})</h3>
                    <button onclick="buyItem('rexar', null, 'TON')">Upgrade TON: ${game.rexar.priceTON}</button>
                </div>` : ''}
        </div>
    `;
}

function save() { localStorage.setItem('gameData', JSON.stringify(game)); renderShop(); }
document.addEventListener("DOMContentLoaded", renderShop);
