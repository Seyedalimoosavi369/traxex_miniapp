function renderShop() {
    const shopContainer = document.getElementById('shop-items');
    shopContainer.innerHTML = '';

    items.forEach(item => {
        shopContainer.innerHTML += `
            <div class="card">
                <div><strong>Item ${item.id}</strong><br>Level: ${item.level}</div>
                <button onclick="buyItem(${item.id})">Buy</button>
            </div>`;
    });

    Object.keys(specialItems).forEach(key => {
        if (key !== 'zeus') {
            shopContainer.innerHTML += `
                <div class="card" style="border: 2px solid gold;">
                    <div><strong>${specialItems[key].name}</strong><br>Level: ${specialItems[key].level}</div>
                    <button onclick="upgradeSpecial('${key}')">Upgrade TON</button>
                </div>`;
        }
    });

    shopContainer.innerHTML += `
        <div class="card" style="border: 2px solid cyan;">
            <div><strong>Zeus Count: ${specialItems.zeus}</strong></div>
            <button onclick="craftZeus()">Craft</button>
        </div>`;
}
