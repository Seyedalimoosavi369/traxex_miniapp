// ۱. لود کردن داده‌های ذخیره شده یا مقادیر پیش‌فرض
let balanceTRX = parseFloat(localStorage.getItem('trx')) || 0;
let balanceTON = parseFloat(localStorage.getItem('ton')) || 0;

let items = JSON.parse(localStorage.getItem('items')) || Array.from({ length: 12 }, (_, i) => ({ 
    id: i + 1, 
    level: 1, 
    baseCost: 1000 
}));

let specialItems = JSON.parse(localStorage.getItem('special')) || { 
    soulkeeper: { level: 0, name: "Soulkeeper" }, 
    rexar: { level: 0, name: "Rexar" }, 
    zeus: 0 
};

// ۲. تابع ذخیره‌سازی در مرورگر
function saveGame() {
    localStorage.setItem('trx', balanceTRX);
    localStorage.setItem('ton', balanceTON);
    localStorage.setItem('items', JSON.stringify(items));
    localStorage.setItem('special', JSON.stringify(specialItems));
}

// ۳. منطق ماینینگ
function mine() {
    let multiplier = 1;
    items.forEach(item => { if (item.level > 1) multiplier *= 2; });
    balanceTRX += (1 * multiplier);
    document.getElementById('balance').innerText = balanceTRX.toLocaleString();
    saveGame(); // ذخیره خودکار
}

// ۴. منطق ارتقای کارت‌های پایه
function buyItem(id) {
    let item = items.find(i => i.id === id);
    let cost = item.baseCost * Math.pow(2, item.level - 1);
    if (balanceTRX >= cost) {
        balanceTRX -= cost;
        item.level++;
        saveGame(); // ذخیره خودکار
        renderShop();
    } else { 
        alert("ترکس کافی نیست!"); 
    }
}

// ۵. منطق کارت‌های خاص و زئوس
function upgradeSpecial(name) {
    let item = specialItems[name];
    let costs = [10, 20, 40];
    if (item.level < 3 && balanceTON >= costs[item.level]) {
        balanceTON -= costs[item.level];
        item.level++;
        saveGame(); // ذخیره خودکار
        renderShop();
    } else { 
        alert("موجودی TON کافی نیست یا به لول نهایی رسیده!"); 
    }
}

function craftZeus() {
    if (specialItems.soulkeeper.level === 3 && specialItems.rexar.level === 3) {
        specialItems.soulkeeper.level = 0;
        specialItems.rexar.level = 0;
        specialItems.zeus++;
        saveGame(); // ذخیره خودکار
        renderShop();
        alert("زئوس ساخته شد!");
    } else { 
        alert("هر دو کارت باید لول ۳ باشند."); 
    }
}
