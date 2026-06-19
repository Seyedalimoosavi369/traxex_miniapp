// --- بخش اول: موجودی و کارت‌های پایه ---
let balanceTRX = 0;
let balanceTON = 0;

let items = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    level: 1, 
    baseCost: 1000 
}));

function mine() {
    let multiplier = 1;
    items.forEach(item => { if (item.level > 1) multiplier *= 2; });
    balanceTRX += (1 * multiplier);
    document.getElementById('balance').innerText = balanceTRX.toLocaleString();
}

function buyItem(id) {
    let item = items.find(i => i.id === id);
    let currentCost = item.baseCost * Math.pow(2, item.level - 1);

    if (balanceTRX >= currentCost) {
        balanceTRX -= currentCost;
        item.level++;
        alert("آیتم پایه ارتقا یافت!");
    } else {
        alert("ترکس کافی نیست!");
    }
}

// --- بخش دوم: کارت‌های خاص و زئوس ---
let specialItems = {
    soulkeeper: { level: 0, name: "Soulkeeper" },
    rexar: { level: 0, name: "Rexar" },
    zeus: 0
};

function upgradeSpecial(name) {
    let item = specialItems[name];
    let costs = [10, 20, 40]; 
    
    if (item.level < 3) {
        let cost = costs[item.level];
        if (balanceTON >= cost) {
            balanceTON -= cost;
            item.level++;
            alert(name + " به لول " + item.level + " ارتقا یافت!");
        } else {
            alert("موجودی TON کافی نیست!");
        }
    } else {
        alert("این کارت به حداکثر لول رسیده است.");
    }
}

function craftZeus() {
    let sk = specialItems.soulkeeper;
    let rx = specialItems.rexar;

    if (sk.level === 3 && rx.level === 3) {
        sk.level = 0;
        rx.level = 0;
        specialItems.zeus++; 
        alert("تبریک! زئوس احضار شد! کارت‌های Soulkeeper و Rexar سوختند.");
    } else {
        alert("برای احضار زئوس، هر دو کارت باید لول ۳ باشند.");
    }
}
