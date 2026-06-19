function renderShop() {
    const shopContainer = document.getElementById('shop-items');
    shopContainer.innerHTML = '<h3>آیتم‌های پایه (TRX)</h3>';
    
    items.forEach(item => {
        shopContainer.innerHTML += `
            <div class="card">
                <div><strong>Item ${item.id}</strong><br>Level: ${item.level}</div>
                <button onclick="buyItem(${item.id})">Buy (${item.baseCost * Math.pow(2, item.level - 1)} TRX)</button>
            </div>`;
    });

    shopContainer.innerHTML += '<h3>آیتم‌های خاص (TON)</h3>';
    Object.keys(specialItems).forEach(key => {
        if (key !== 'zeus') {
            shopContainer.innerHTML += `
                <div class="card" style="border: 2px solid gold;">
                    <div><strong>${specialItems[key].name}</strong><br>Level: ${specialItems[key].level}</div>
                    <button onclick="upgradeSpecial('${key}')">Buy (${specialItems[key].cost} TON)</button>
                </div>`;
        }
    });
}
