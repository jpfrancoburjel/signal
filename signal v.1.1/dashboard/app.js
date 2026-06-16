const data = window.signalPortfolio;

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: data.baseCurrency,
  maximumFractionDigits: 0
});

const number = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0
});

const pct = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

const byId = (id) => document.getElementById(id);
const groupBy = (items, keyFn) => items.reduce((acc, item) => {
  const key = keyFn(item);
  acc[key] = acc[key] || [];
  acc[key].push(item);
  return acc;
}, {});
const sum = (items, getter) => items.reduce((acc, item) => acc + getter(item), 0);
const toBase = (amount, currency) => amount * (data.fxRatesToBase[currency] || 1);
const formatNative = (amount, currency) => `${number.format(amount)} ${currency}`;
const share = (value, total) => total === 0 ? 0 : (value / total) * 100;

const cashAccounts = data.cashAccounts.map((item) => ({ ...item, baseValue: toBase(item.balance, item.currency) }));
const investments = data.investments.map((item) => ({ ...item, baseValue: toBase(item.value, item.currency) }));
const totalCash = sum(cashAccounts, (item) => item.baseValue);
const totalInvested = sum(investments, (item) => item.baseValue);
const totalTracked = totalCash + totalInvested;
const allRows = [
  ...cashAccounts.map((item) => ({ owner: item.owner, institution: item.institution, account: item.account, baseValue: item.baseValue, kind: 'cash' })),
  ...investments.map((item) => ({ owner: item.owner, institution: item.institution, account: item.name, baseValue: item.baseValue, kind: 'investment' }))
];

const currencyExposure = Object.entries(data.fxRatesToBase).map(([currency]) => {
  const cashTotal = sum(cashAccounts.filter((item) => item.currency === currency), (item) => item.balance);
  const investmentTotal = sum(investments.filter((item) => item.currency === currency), (item) => item.value);
  const nativeTotal = cashTotal + investmentTotal;
  const baseValue = toBase(nativeTotal, currency);
  return { currency, nativeTotal, baseValue, pct: share(baseValue, totalTracked) };
}).filter((item) => item.nativeTotal > 0).sort((a, b) => b.baseValue - a.baseValue);

const ownerExposure = Object.entries(groupBy(allRows, (item) => item.owner)).map(([name, rows]) => ({
  name,
  value: sum(rows, (item) => item.baseValue),
  pct: share(sum(rows, (item) => item.baseValue), totalTracked),
  cashValue: sum(rows.filter((item) => item.kind === 'cash'), (item) => item.baseValue),
  investedValue: sum(rows.filter((item) => item.kind === 'investment'), (item) => item.baseValue)
})).sort((a, b) => b.value - a.value);

const institutionExposure = Object.entries(groupBy(allRows, (item) => item.institution)).map(([name, rows]) => ({
  name,
  value: sum(rows, (item) => item.baseValue),
  pct: share(sum(rows, (item) => item.baseValue), totalTracked),
  cashValue: sum(rows.filter((item) => item.kind === 'cash'), (item) => item.baseValue),
  investedValue: sum(rows.filter((item) => item.kind === 'investment'), (item) => item.baseValue)
})).sort((a, b) => b.value - a.value);

const largestInstitution = institutionExposure[0];
const largestAccount = cashAccounts.slice().sort((a, b) => b.baseValue - a.baseValue)[0];
const largestCurrency = currencyExposure[0];
const lockedInvestments = sum(investments.filter((item) => item.liquidity === 'locked'), (item) => item.baseValue);
const liquidInvestments = sum(investments.filter((item) => item.liquidity === 'liquid'), (item) => item.baseValue);

byId('householdName').textContent = data.householdName;
byId('headerMeta').textContent = `As of ${data.asOf} · ${cashAccounts.length} cash accounts · ${investments.length} investment lines`;
byId('baseCurrencyBadge').textContent = `Base currency: ${data.baseCurrency}`;
byId('fxNoteBadge').textContent = `FX approx: USD ${data.fxRatesToBase.USD} / UYU ${data.fxRatesToBase.UYU}`;
byId('totalTracked').textContent = money.format(totalTracked);
byId('trackedFootnote').textContent = `${pct.format(share(totalCash, totalTracked))}% cash · ${pct.format(share(totalInvested, totalTracked))}% invested`;
byId('liquidCash').textContent = money.format(totalCash);
byId('cashFootnote').textContent = `${formatNative(71525, 'UYU')} · ${formatNative(5169, 'USD')} · ${formatNative(43788, 'EUR')}`;
byId('investedAssets').textContent = money.format(totalInvested);
byId('investedFootnote').textContent = `${investments.length} lines tracked · gains still live in another sheet`;
byId('largestInstitution').textContent = largestInstitution.name;
byId('largestInstitutionFootnote').textContent = `${money.format(largestInstitution.value)} · ${pct.format(largestInstitution.pct)}% of tracked wealth`;

byId('currencyList').innerHTML = currencyExposure.map((item) => `
  <div class="alloc-row">
    <div class="alloc-top">
      <strong>${item.currency}</strong>
      <span>${formatNative(item.nativeTotal, item.currency)} · ${money.format(item.baseValue)}</span>
    </div>
    <div class="track"><div class="fill" style="width:${item.pct}%"></div></div>
    <div class="row-footnote subtle">${pct.format(item.pct)}% of total tracked wealth</div>
  </div>
`).join('');

byId('ownerList').innerHTML = ownerExposure.map((item) => `
  <div class="owner-row">
    <div class="owner-top">
      <strong>${item.name}</strong>
      <span>${money.format(item.value)} · ${pct.format(item.pct)}%</span>
    </div>
    <div class="track"><div class="fill" style="width:${item.pct}%"></div></div>
    <div class="row-footnote subtle">Cash ${money.format(item.cashValue)} · Invested ${money.format(item.investedValue)}</div>
  </div>
`).join('');

byId('institutionList').innerHTML = institutionExposure.map((item) => `
  <div class="alloc-row">
    <div class="alloc-top">
      <strong>${item.name}</strong>
      <span>${money.format(item.value)} · ${pct.format(item.pct)}%</span>
    </div>
    <div class="track"><div class="fill" style="width:${item.pct}%"></div></div>
    <div class="row-footnote subtle">Cash ${money.format(item.cashValue)} · Invested ${money.format(item.investedValue)}</div>
  </div>
`).join('');

const signals = [
  { label: 'Largest cash account', value: largestAccount.account, footnote: `${money.format(largestAccount.baseValue)} · ${formatNative(largestAccount.balance, largestAccount.currency)}` },
  { label: 'Largest currency', value: largestCurrency.currency, footnote: `${money.format(largestCurrency.baseValue)} · ${pct.format(largestCurrency.pct)}% of tracked wealth` },
  { label: 'Locked retirement / pension', value: money.format(lockedInvestments), footnote: `${pct.format(share(lockedInvestments, totalTracked))}% of tracked wealth` },
  { label: 'Liquid investments', value: money.format(liquidInvestments), footnote: `${pct.format(share(liquidInvestments, totalTracked))}% of tracked wealth` }
];

byId('signalGrid').innerHTML = signals.map((item) => `
  <div class="signal-card">
    <div class="signal-label">${item.label}</div>
    <div class="signal-value">${item.value}</div>
    <div class="signal-footnote subtle">${item.footnote}</div>
  </div>
`).join('');

const ownerTree = Object.entries(groupBy(allRows, (item) => item.owner)).map(([owner, ownerRows]) => ({
  owner,
  value: sum(ownerRows, (item) => item.baseValue),
  institutions: Object.entries(groupBy(ownerRows, (item) => item.institution)).map(([institution, institutionRows]) => ({
    institution,
    value: sum(institutionRows, (item) => item.baseValue),
    accounts: institutionRows.sort((a, b) => b.baseValue - a.baseValue)
  })).sort((a, b) => b.value - a.value)
})).sort((a, b) => b.value - a.value);

byId('moneyTree').innerHTML = ownerTree.map((ownerGroup) => `
  <div class="tree-owner">
    <div class="tree-owner-head">
      <strong>${ownerGroup.owner}</strong>
      <span>${money.format(ownerGroup.value)}</span>
    </div>
    ${ownerGroup.institutions.map((institution) => `
      <div class="tree-branch">
        <div class="tree-branch-head">
          <span>${institution.institution}</span>
          <span>${money.format(institution.value)}</span>
        </div>
        <div class="tree-leaves">
          ${institution.accounts.map((account) => `
            <div class="tree-leaf">
              <span>${account.account}</span>
              <span>${money.format(account.baseValue)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  </div>
`).join('');

byId('cashAccountsTable').innerHTML = cashAccounts.sort((a, b) => b.baseValue - a.baseValue).map((item) => `
  <div class="table-row cash-table-row">
    <div><strong>${item.account}</strong></div>
    <div>${item.owner}</div>
    <div>${item.institution}</div>
    <div>${item.currency}</div>
    <div>${formatNative(item.balance, item.currency)}</div>
    <div>${money.format(item.baseValue)}</div>
    <div class="hide-mobile"><span class="badge">${item.accountType}</span></div>
  </div>
`).join('');

byId('investmentsTable').innerHTML = investments.sort((a, b) => b.baseValue - a.baseValue).map((item) => `
  <div class="table-row investment-table-row">
    <div><strong>${item.name}</strong></div>
    <div>${item.owner}</div>
    <div>${item.institution}</div>
    <div>${item.type}</div>
    <div>${item.currency}</div>
    <div>${money.format(item.baseValue)}</div>
    <div class="hide-mobile"><span class="badge">${item.liquidity}</span></div>
  </div>
`).join('');

byId('footerNote').textContent = data.notes.join(' · ');
