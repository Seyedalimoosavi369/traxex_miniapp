function renderShop() {
    const shopContainer = document.getElementById('shop-items');
    shopContainer.innerHTML = '';

    items.forEach(item => {
        shopContainer.innerHTML += `
            <div class="card">
                <strong>Item ${item.id}</strong> - Level: ${item.level}
                <button onclick="buyItem(${item.id})">Buy</button>
            </div>`;
    });

    Object.keys(specialItems).forEach(key => {
        if (key !== 'zeus') {
            shopContainer.innerHTML += `
                <div class="card" style="border: 2px solid gold;">
                    <strong>${specialItems[key].name}</strong> - Level: ${specialItems[key].level}
                    <button onclick="upgradeSpecial('${key}')">Upgrade TON</button>
                </div>`;
        }
    });

    shopContainer.innerHTML += `
        <div class="card" style="border: 2px solid cyan;">
            <strong>Zeus Count: ${specialItems.zeus}</strong>
            <button onclick="craftZeus()">Craft</button>
        </div>`;
}
