// دیتا برای نمایش درخت
let networkData = {
    totalNetwork: 125,
    leftCount: 62,
    rightCount: 63,
    binaryIncome: 325.50
};

function renderNetwork() {
    const container = document.getElementById('network');
    container.innerHTML = `
        <div class="network-container">
            <h2>Network</h2>
            <div class="tree-stats">
                <div class="stat-box">Total Network <span>${networkData.totalNetwork}</span></div>
            </div>
            <div class="binary-tree">
                <div class="node-root">YOU</div>
                <div class="branches">
                    <div class="branch">Left: ${networkData.leftCount}</div>
                    <div class="branch">Right: ${networkData.rightCount}</div>
                </div>
            </div>
            <div class="income-box">
                <p>Binary Income: ${networkData.binaryIncome} TRX</p>
                <button class="claim-btn">Claim</button>
            </div>
        </div>
    `;
}
