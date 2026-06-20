function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

function renderShop() {
    const container = document.getElementById('shop-items');
    container.innerHTML = `
        <div class="card">
            <strong>خرید Auto-Mine</strong>
            <button onclick="buyWithTRX()">خرید با 1000 TRX</button>
            <button onclick="buyWithTON()">خرید با 1 TON</button>
        </div>`;
}
renderShop();
