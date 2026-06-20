let balanceTRX = parseFloat(localStorage.getItem('trx')) || 0;
let balanceTON = parseFloat(localStorage.getItem('ton')) || 0;

let items = JSON.parse(localStorage.getItem('items')) || Array.from({ length: 12 }, (_, i) => ({ id: i + 1, level: 1, baseCost: 1000 }));
let specialItems = JSON.parse(localStorage.getItem('special')) || { 
    soulkeeper: { level: 0, name: "Soulkeeper", cost: 10 }, 
    rexar: { level: 0, name: "Rexar", cost: 10 }, 
    zeus: 0 
};

function saveGame() {
    localStorage.setItem('trx', balanceTRX);
    localStorage.setItem('ton', balanceTON);
    localStorage.setItem('items', JSON.stringify(items));
    localStorage.setItem('special', JSON.stringify(specialItems));
}

function mine() {
    balanceTRX += 1;
    document.getElementById('balance').innerText = balanceTRX.toLocaleString();
    saveGame();
}

function buyItem(id) {
    let item = items.find(i => i.id === id);
    let cost = item.baseCost * Math.pow(2, item.level - 1);
    if (balanceTRX >= cost) {
        balanceTRX -= cost;
        item.level++;
        saveGame();
        document.getElementById('balance').innerText = balanceTRX.toLocaleString();
        renderShop();
    } else { alert("ترکس کافی نیست!"); }
}

function upgradeSpecial(name) {
    let item = specialItems[name];
    if (item.level < 3 && balanceTON >= item.cost) {
        balanceTON -= item.cost;
        item.level++;
        item.cost *= 2;
        saveGame();
        document.getElementById('ton-balance').innerText = balanceTON;
        renderShop();
    } else { alert("تون کافی نیست یا به حداکثر رسیده!"); }
}

function craftZeus() {
    if (specialItems.soulkeeper.level === 3 && specialItems.rexar.level === 3) {
        specialItems.soulkeeper.level = 0; specialItems.rexar.level = 0;
        specialItems.zeus++;
        saveGame(); renderShop();
    } else { alert("نیاز به لول ۳ برای هر دو!"); }
}
