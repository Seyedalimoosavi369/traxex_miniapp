let balance = 0;

const mineBtn = document.getElementById("mineBtn");

mineBtn.addEventListener("click", () => {

balance += 4;

document.getElementById("balance").innerText = balance;

Telegram.WebApp.sendData(
"MINE_DONE:"
);

});
