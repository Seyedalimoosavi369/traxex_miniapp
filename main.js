console.log("TRAX System Loaded - Version 2.0");

// ساختار ۱۲ آیتم شما
const itemsData = [
    { id: 1, name: "Iron Pickaxe" }, { id: 2, name: "Bronze Drill" }, { id: 3, name: "Silver Chisel" },
    { id: 4, name: "Gold Hammer" }, { id: 5, name: "Platinum Blade" }, { id: 6, name: "Diamond Cutter" },
    { id: 7, name: "Titanium Axe" }, { id: 8, name: "Ruby Saw" }, { id: 9, name: "Emerald Shovel" },
    { id: 10, name: "Sapphire Pick" }, { id: 11, name: "Obsidian Maul" }, { id: 12, name: "Void Breaker" }
];

function updateShopUI() {
    const shopContainer = document.getElementById('shop-items');
    if (!shopContainer) return;

    shopContainer.innerHTML = ''; // پاکسازی قبلی‌ها

    itemsData.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'shop-card';
        itemElement.innerHTML = `
            <img src="assets/item${item.id}.png" alt="${item.name}">
            <h3>${item.name}</h3>
            <button onclick="buy('${item.name}', 1000, 'TRX')">Buy TRX (1000)</button>
            <button onclick="buy('${item.name}', 1, 'TON')">Buy TON (1)</button>
        `;
        shopContainer.appendChild(itemElement);
    });
    console.log("UI Updated with 12 items");
}

function buy(itemName, price, currency) {
    alert(`Purchased ${itemName} with ${currency} for ${price}`);
    // اینجا منطقِ ضرب در ۲ را اضافه خواهیم کرد
}

// اجرای اولیه
document.addEventListener('DOMContentLoaded', updateShopUI);
