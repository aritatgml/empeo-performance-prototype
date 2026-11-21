// Small shared helpers for building HTML strings.

function initials(n) {
  return n
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("");
}

function pill(s) {
  let c = /Overdue|Needs|Review needed/i.test(s)
    ? "amber"
    : /Approved|Complete|Consistent|Evidence supported/i.test(s)
      ? "green"
      : /Flag|Low/i.test(s)
        ? "red"
        : "info";
  return /* HTML */ `<span class="pill ${c}">${s}</span>`;
}

function cardStat(label, value, foot, cls = "") {
  return /* HTML */ `<div class="card">
    <div class="stat-label">${label}</div>
    <div class="stat-value ${cls}">${value}</div>
    <div class="stat-foot">${foot}</div>
  </div>`;
}

function head(ey, title, sub, action = "") {
  return /* HTML */ `<div class="page-head">
    <div>
      <div class="eyebrow">${ey}</div>
      <h1>${title}</h1>
      <div class="sub">${sub}</div>
    </div>
    ${action}
  </div>`;
}
