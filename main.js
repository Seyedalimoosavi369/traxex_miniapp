function showPage(pageId) {
    // مخفی کردن همه صفحه‌ها
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    // نمایش صفحه انتخابی
    const target = document.getElementById(pageId);
    target.classList.add('active');
    target.style.display = 'block';
}

function mine() {
    let balance = parseFloat(document.getElementById('balance').innerText);
    balance += 0.01;
    document.getElementById('balance').innerText = balance.toFixed(2);
    // ذخیره در LocalStorage برای جلوگیری از صفر شدن
    localStorage.setItem('trx_balance', balance.toFixed(2));
}

// لود کردن موجودی در ابتدای باز شدن
document.addEventListener("DOMContentLoaded", () => {
    const savedBalance = localStorage.getItem('trx_balance');
    if (savedBalance) {
        document.getElementById('balance').innerText = savedBalance;
    }
    // تنظیم صفحه پیش‌فرض
    showPage('home');
});
