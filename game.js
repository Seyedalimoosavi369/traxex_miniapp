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
