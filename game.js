let balanceTRX = 0;
let balanceTON = 0;

let items = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, level: 1, baseCost: 1000 }));
let specialItems = { 
    soulkeeper: { level: 0, name: "Soulkeeper" }, 
    rexar: { level: 0, name: "Rexar" }, 
    zeus: 0 
};

function mine() {
    let multiplier = 1;
    items.forEach(item => { if (item.level > 1) multiplier *= 2; });
    balanceTRX += (1 * multiplier);
    document.getElementById('balance').innerText = balanceTRX.toLocaleString();
}

function buyItem(id) {
    let item = items.find(i => i.id === id);
    let cost = item.baseCost * Math.pow(2, item.level - 1);
    if (balanceTRX >= cost) {
        balanceTRX -= cost;
        item.level++;
        renderShop();
    } else { alert("ترکس کافی نیست!"); }
}

function upgradeSpecial(name) {
    let item = specialItems[name];
    let costs = [10, 20, 40];
    if (item.level < 3 && balanceTON >= costs[item.level]) {
        balanceTON -= costs[item.level];
        item.level++;
        renderShop();
    } else { alert("موجودی TON کافی نیست یا به لول نهایی رسیده!"); }
}

function craftZeus() {
    if (specialItems.soulkeeper.level === 3 && specialItems.rexar.level === 3) {
        specialItems.soulkeeper.level = 0;
        specialItems.rexar.level = 0;
        specialItems.zeus++;
        renderShop();
        alert("زئوس ساخته شد!");
    } else { alert("هر دو کارت باید لول ۳ باشند."); }
}
