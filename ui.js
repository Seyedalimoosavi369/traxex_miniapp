function renderShop() {
    const shopContainer = document.getElementById('shop-items');
    
    // پاک کردن محتوای قبلی برای جلوگیری از تکرار کارت‌ها
    shopContainer.innerHTML = '';

    // ۱. نمایش ۱۲ کارت پایه
    items.forEach(item => {
        shopContainer.innerHTML += `
            <div class="card">
                <img src="item${item.id}.png" style="width:50px; height:50px; border-radius:8px;">
                <div style="flex-grow:1; margin:0 10px;">
                    <strong>Item ${item.id}</strong><br>
                    <small>Level: ${item.level}</small>
                </div>
                <button onclick="buyItem(${item.id})">Buy</button>
            </div>`;
    });

    // ۲. نمایش کارت‌های خاص (Soulkeeper و Rexar)
    Object.keys(specialItems).forEach(key => {
        if (key !== 'zeus') {
            shopContainer.innerHTML += `
                <div class="card" style="border: 2px solid #ffd700;">
                    <img src="${key}.png" style="width:50px; height:50px; border-radius:8px;">
                    <div style="flex-grow:1; margin:0 10px;">
                        <strong>${specialItems[key].name}</strong><br>
                        <small>Level: ${specialItems[key].level}</small>
                    </div>
                    <button onclick="upgradeSpecial('${key}')">Upgrade (TON)</button>
                </div>`;
        }
    });

    // ۳. نمایش کارت نهایی زئوس
    shopContainer.innerHTML += `
        <div class="card" style="border: 2px solid #00f2ff; background: #1a1f2e;">
            <img src="zeus.png" style="width:50px; height:50px; border-radius:8px;">
            <div style="flex-grow:1; margin:0 10px;">
                <strong>Zeus (The Ultimate)</strong><br>
                <small>Owned: ${specialItems.zeus}</small>
            </div>
            <button onclick="craftZeus()">Craft</button>
        </div>`;
}
