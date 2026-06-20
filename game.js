let balanceTRX = parseFloat(localStorage.getItem('trx')) || 0;
let balanceTON = parseFloat(localStorage.getItem('ton')) || 0;
let leftCount = parseInt(localStorage.getItem('leftCount')) || 0;
let rightCount = parseInt(localStorage.getItem('rightCount')) || 0;

function checkBinaryBonus() {
    // منطق تعادل: اگر هر دو برابر بودند و در اعداد خاص بودند
    if (leftCount === rightCount && [10, 50, 100, 500].includes(leftCount)) {
        let bonus = leftCount * rightCount;
        balanceTRX += bonus;
        alert("تبریک! تعادل برقرار شد. پاداش: " + bonus + " TRX");
        saveGame();
    }
}

function processReferralBonus(level) {
    let percent = level === 1 ? 0.10 : (level === 2 ? 0.01 : 0.001);
    balanceTRX += (1000 * percent); // پاداش تا لول ۱۰۰۰
    saveGame();
}

function mine() {
    balanceTRX += 1;
    document.getElementById('balance').innerText = balanceTRX.toLocaleString();
    saveGame();
}

function saveGame() {
    localStorage.setItem('trx', balanceTRX);
    localStorage.setItem('ton', balanceTON);
    localStorage.setItem('leftCount', leftCount);
    localStorage.setItem('rightCount', rightCount);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('balance').innerText = balanceTRX.toLocaleString();
    document.getElementById('left-count').innerText = leftCount;
    document.getElementById('right-count').innerText = rightCount;
});
