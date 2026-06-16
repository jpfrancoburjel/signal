const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

const pct = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

const data = window.signalPortfolio;

const byId = (id) => document.getElementById(id);
const sum = (items, key) => items.reduce((acc, item) => acc + item[key], 0);

byId('householdName').textContent = data.householdName;
byId('totalValue').textContent = money.format(data.summary.totalValue);
byId('totalGain').textContent = money.format(data.summary.totalGain);
byId('cashFlow').textContent = money.format(data.summary.cashFlowForward);
byId('yearlyChange').textContent = `+${pct.format(data.summary.yearlyChangePct)}% YoY`;
byId('gainPct').textContent = `${pct.format((data.summary.totalGain / data.summary.totalCost) * 100)}% over cost basis`;

function renderTimeline(period) {
  const points = data.timeline[period];
  const timelineMax = Math.max(...points.map((item) => item.value));
  byId('timelineChart').innerHTML = points.map((point) => {
    const height = Math.max(24, Math.round((point.value / timelineMax) * 210));
    return `
      <div class="bar-col animate-fade-in">
        <div class="bar-value">${money.format(point.value)}</div>
        <div class="bar" style="height:${height}px"></div>
        <div class="bar-label">${point.label}</div>
      </div>
    `;
  }).join('');
}

renderTimeline('months');

document.querySelectorAll('.chart-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    renderTimeline(e.target.dataset.period);
  });
});

byId('allocationList').innerHTML = data.allocations.map((item) => `
  <div class="alloc-row">
    <div class="alloc-top">
      <strong>${item.label}</strong>
      <span>${pct.format(item.pct)}% · ${money.format(item.value)}</span>
    </div>
    <div class="track"><div class="fill" style="width:${item.pct}%"></div></div>
  </div>
`).join('');

byId('ownerList').innerHTML = data.owners.map((item) => `
  <div class="owner-row">
    <div class="owner-top">
      <strong>${item.name}</strong>
      <span>${pct.format(item.pct)}% · ${money.format(item.value)}</span>
    </div>
    <div class="track"><div class="fill" style="width:${item.pct}%"></div></div>
  </div>
`).join('');

byId('holdingsTable').innerHTML = data.holdings.map((item) => `
  <div class="table-row">
    <div><strong>${item.name}</strong></div>
    <div>${item.type}</div>
    <div>${item.owner}</div>
    <div class="hide-mobile">${item.account}</div>
    <div>${money.format(item.value)}</div>
    <div>
      <span class="${item.changePct >= 0 ? 'pos' : 'neg'}">${item.changePct >= 0 ? '+' : ''}${pct.format(item.changePct)}%</span>
      <span class="badge">${item.conviction}</span>
    </div>
  </div>
`).join('');

const riskScore = Math.round(((sum(data.allocations.filter(x => x.label !== 'Cash'), 'pct') * 0.72) + (data.allocations.find(x => x.label === 'Cash').pct * 0.18)) / 10);
byId('riskSignal').textContent = `${riskScore}/10`;