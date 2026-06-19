// موجودی و تنظیمات اولیه
let balanceTRX = 0;
let balanceTON = 0;

// لیست ۱۲ آیتم پایه
let items = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    level: 1, // شروع از لول ۱ (خام)
    baseCost: 1000 // قیمت پایه به ترکس
}));

// تابع ماین کردن
function mine() {
    // ضریب کلیک: هر کارت لول ۱ به بالا، ضرب در ۲ می‌کند
    let multiplier = 1;
    items.forEach(item => { if (item.level > 1) multiplier *= 2; });
    
    balanceTRX += (1 * multiplier);
    document.getElementById('balance').innerText = balanceTRX.toLocaleString();
}

// تابع ارتقای کارت‌های پایه (با ترکس)
function buyItem(id) {
    let item = items.find(i => i.id === id);
    let currentCost = item.baseCost * Math.pow(2, item.level - 1);

    if (balanceTRX >= currentCost) {
        balanceTRX -= currentCost;
        item.level++;
        alert("آیتم ارتقا یافت!");
        renderShop();
    } else {
        alert("ترکس کافی نیست!");
    }
}

// --- منطق کارت‌های خاص و زئوس (اضافه شده به انتهای فایل) ---

let specialItems = {
    soulkeeper: { level: 0, name: "Soulkeeper" },
    rexar: { level: 0, name: "Rexar" },
    zeus: 0
};

// ارتقای سول‌کیپر و رکسار با TON
function upgradeSpecial(name) {
    let item = specialItems[name];
    let costs = [10, 20, 40]; // لول ۱: ۱۰، لول ۲: ۲۰، لول ۳: ۴۰
    
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

// سیستم سوزاندن برای ساخت زئوس
function craftZeus() {
    let sk = specialItems.soulkeeper;
    let rx = specialItems.rexar;

    if (sk.level === 3 && rx.level === 3) {
        // سوزاندن
        sk.level = 0;
        rx.level = 0;
        specialItems.zeus++; // زئوس ساخته شد!
        
        alert("تبریک! زئوس احضار شد! کارت‌های Soulkeeper و Rexar سوختند.");
    } else {
        alert("برای احضار زئوس، هر دو کارت باید لول ۳ باشند.");
    }
                 }
