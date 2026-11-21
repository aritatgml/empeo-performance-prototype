// HR Assessment Dashboard: results of every assessment type across the organization.
// Shows submitted ASSESSMENT RESULTS only. AI calibration recommendations stay on the
// AI Calibration page. Depends on: assessment-data.js, utils.js (head, cardStat),
// and app.js (render, go).

const adState = {
  type: "down",
  dept: "all",
  level: "all",
  position: "all",
  groupBy: "dept",
};

const AD_GROUPS = [
  { key: "dept", label: "Department" },
  { key: "level", label: "Job level" },
  { key: "position", label: "Position" },
];

// ---- Interactions ---------------------------------------------------------

// Positions available under the current department + level filters.
function adPositions(all) {
  return [
    ...new Set(
      filterRecords(all, { ...adState, position: "all" }).map(
        (r) => r.position,
      ),
    ),
  ].sort();
}

function adSet(key, value) {
  adState[key] = value;
  // Keep the Position filter valid after Department / Level change.
  if (key === "dept" || key === "level") {
    if (!adPositions(assessmentRecords()).includes(adState.position))
      adState.position = "all";
  }
  render();
}

function adReset() {
  Object.assign(adState, { dept: "all", level: "all", position: "all" });
  render();
}

// ---- Small helpers --------------------------------------------------------

const adNum = (n) => (n == null ? "–" : n.toFixed(1));

function adSigned(d) {
  if (Math.abs(d) < 0.05) return "±0.0";
  return `${d > 0 ? "+" : "−"}${Math.abs(d).toFixed(1)}`;
}

function adStack(g) {
  const segs = g.hidden
    ? ""
    : g.items
        .filter((i) => i.count)
        .map(
          (i) =>
            `<span class="g-${i.grade.key}" style="width:${i.pct}%" title="${i.grade.label}: ${i.count}"></span>`,
        )
        .join("");
  return `<div class="gstack">${segs}</div>`;
}

function adLegend(g) {
  return `<div class="legend">${g.items
    .map(
      (i) =>
        `<span><i class="dot g-${i.grade.key}"></i>${i.grade.short}${g.total ? ` ${i.count}` : ""}</span>`,
    )
    .join("")}</div>`;
}

// ---- Sections -------------------------------------------------------------

function adFilters(all, recs) {
  const select = (key, label, options, allLabel) =>
    /* HTML */ `<label class="ad-field">
      <span class="kpi">${label}</span>
      <select class="role-select" onchange="adSet('${key}', this.value)">
        <option value="all">${allLabel}</option>
        ${options.map((o) => `<option value="${o}" ${adState[key] === o ? "selected" : ""}>${o}</option>`).join("")}
      </select>
    </label>`;
  const depts = [...new Set(all.map((r) => r.dept))].sort();
  const active = ["dept", "level", "position"].some(
    (k) => adState[k] !== "all",
  );
  return /* HTML */ `<div class="card ad-filters">
    ${select("dept", "Department", depts, "All departments")}
    ${select("level", "Job level", LEVELS, "All levels")}
    ${select("position", "Position", adPositions(all), "All positions")}
    <div class="ad-filter-meta">
      <span class="kpi"
        >Showing <b>${recs.length}</b> of ${all.length} employees</span
      >
      ${active ? `<button class="btn ghost small" onclick="adReset()">Reset filters</button>` : ""}
    </div>
  </div>`;
}

// A. Organization overview (based on manager assessments, the official rating)
function adOverview(all, recs) {
  const s = typeStats(recs, "down");
  const org = typeStats(all, "down");
  const filtered = recs.length !== all.length;
  const g = gradeCounts(recs, "down");
  return /* HTML */ `<div class="grid stats">
    ${cardStat("Employees assessed", s.completed, `of ${s.assigned} employees${filtered ? " in this view" : ""}`)}
    ${cardStat("Assessment completion rate", `${s.pct}%`, `${s.assigned - s.completed} manager assessments pending`)}
    ${cardStat("Average performance score", s.avg == null ? "–" : `${adNum(s.avg)}<span style="font-size:13px;color:var(--muted)"> / 5</span>`, filtered && org.avg != null ? `Organization: ${adNum(org.avg)}` : "Manager assessments")}
    <div class="card">
      <div class="stat-label">Grade distribution</div>
      ${adStack(g)}${adLegend(g)}
    </div>
  </div>`;
}

// B. Assessment type breakdown (click a card to explore that type below)
function adTypeCards(recs) {
  return /* HTML */ `<div class="grid stats">
    ${ASSESSMENT_TYPES.map((t) => {
      const s = typeStats(recs, t.key);
      const selected = adState.type === t.key;
      const notes = {
        down: `${s.assigned - s.completed} still pending`,
        self:
          s.selfGap == null
            ? ""
            : `Self vs manager rating: ${adSigned(s.selfGap)} on average`,
        up: s.hidden
          ? `Hidden: fewer than ${MIN_UPWARD_RESPONSES} responses`
          : "Anonymous · shown in aggregate",
        peer: `${s.employees} of ${s.eligible} employees received feedback`,
      };
      return /* HTML */ `<button
        class="card mstat ad-type ${selected ? "selected" : ""}"
        onclick="adSet('type','${t.key}')"
        aria-pressed="${selected}"
      >
        <span class="stat-label"
          >${t.label}<br /><span class="kpi">${t.sub}</span></span
        >
        <span class="stat-value"
          >${s.completed}<small> / ${s.assigned}</small></span
        >
        <span class="stat-foot">${t.noun} completed (${s.pct}%)</span>
        <span class="bar ad-bar"><span style="width:${s.pct}%"></span></span>
        <span class="ad-avg"
          >Average score
          <b>${adNum(s.avg)}${s.avg == null ? "" : " / 5"}</b></span
        >
        <span class="stat-foot">${notes[t.key]}</span>
        <span class="ad-hint"
          >${selected ? "Showing below ↓" : "Select to explore"}</span
        >
      </button>`;
    }).join("")}
  </div>`;
}

// C. Performance grade distribution for the selected assessment type
function adGradeChart(recs) {
  const t = ASSESSMENT_TYPES.find((x) => x.key === adState.type);
  const g = gradeCounts(recs, t.key);
  let body;
  if (g.hidden) {
    body = `<div class="empty">Upward results are hidden when fewer than ${MIN_UPWARD_RESPONSES} responses match, to protect anonymity.</div>`;
  } else if (!g.total) {
    body = `<div class="empty">No completed ${t.noun} for this selection.</div>`;
  } else {
    body = `<div class="gchart">${g.items
      .map(
        (i) =>
          /* HTML */ `<div class="grow">
            <div>
              <b>${i.grade.label}</b>
              <div class="kpi">${i.grade.range}</div>
            </div>
            <div class="gtrack">
              <span class="g-${i.grade.key}" style="width:${i.pct}%"></span>
            </div>
            <div class="gnum">
              <b>${i.count}</b> <span class="kpi">${Math.round(i.pct)}%</span>
            </div>
          </div>`,
      )
      .join("")}</div>`;
  }
  return /* HTML */ `<div class="card">
    <div class="section-head">
      <div>
        <h2>Performance grade distribution</h2>
        <div class="sub">
          ${t.label} · ${g.hidden ? "hidden" : `${g.total} ${t.unit}`}
        </div>
      </div>
      <span class="pill info">${t.label}</span>
    </div>
    ${body}
  </div>`;
}

// D. Organizational performance breakdown by department / job level / position
function adBreakdown(all, recs) {
  const t = ASSESSMENT_TYPES.find((x) => x.key === adState.type);
  const dim = adState.groupBy;
  const dimLabel = AD_GROUPS.find((g) => g.key === dim).label;
  const rows = groupStats(recs, t.key, dim);
  const org = typeStats(all, t.key).avg;
  const tr = rows
    .map((r) => {
      const small =
        r.employees < SMALL_GROUP
          ? ` <span class="pill">Small group</span>`
          : "";
      const avg =
        r.avg != null
          ? `<div class="avg-cell"><b>${adNum(r.avg)}</b><div class="bar"><span style="width:${(r.avg / 5) * 100}%"></span></div></div>`
          : `<span class="kpi">${r.hidden ? "Hidden" : "–"}</span>`;
      const delta = r.avg != null && org != null ? adSigned(r.avg - org) : "–";
      const done = r.eligible
        ? Math.round((r.employees / r.eligible) * 100)
        : 0;
      const action =
        adState[dim] === r.key
          ? `<button class="btn ghost small" onclick="adSet('${dim}','all')">Clear</button>`
          : `<button class="btn ghost small" onclick="adSet('${dim}','${r.key}')">Filter →</button>`;
      return /* HTML */ `<tr>
        <td><b>${r.key}</b>${small}</td>
        <td>${r.size}</td>
        <td>
          ${r.employees} of ${r.eligible} <span class="kpi">${done}%</span>
        </td>
        <td>${avg}</td>
        <td class="delta">${delta}</td>
        <td class="gcell">${adStack(r.grades)}</td>
        <td class="right">${action}</td>
      </tr>`;
    })
    .join("");
  return /* HTML */ `<div class="card">
    <div class="section-head">
      <div>
        <h2>Organizational performance breakdown</h2>
        <div class="sub">
          ${t.label} · compare groups within the current filters
        </div>
      </div>
    </div>
    <div class="tabs">
      ${AD_GROUPS.map((g) => `<button class="${g.key === dim ? "active" : ""}" onclick="adSet('groupBy','${g.key}')">${g.label}</button>`).join("")}
    </div>
    ${adLegend(gradeCounts(recs, t.key))}
    <div class="table-wrap ad-table">
      <table>
        <thead>
          <tr>
            <th>${dimLabel}</th>
            <th>Employees</th>
            <th>Completed</th>
            <th>Avg score</th>
            <th
              title="Difference from the organization-wide average for this assessment type"
            >
              vs org avg
            </th>
            <th>Grade distribution</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${tr}
        </tbody>
      </table>
    </div>
    <div class="callout">
      Differences between groups are prompts for HR to investigate, not
      conclusions. They can reflect team size, role mix, job level, timing or
      how many assessments are still outstanding, and do not by themselves
      indicate biased managers. Groups marked “Small group” have fewer than
      ${SMALL_GROUP} completed assessments, so averages can swing widely.
    </div>
  </div>`;
}

// ---- Page -----------------------------------------------------------------

function assessmentDashboard() {
  const all = assessmentRecords();
  const recs = filterRecords(all, adState);
  const filtered = recs.length !== all.length;
  const top = /* HTML */ `${head("ASSESSMENT RESULTS", "Assessment dashboard", "Submitted assessment results across the organization · FY2026 Annual Performance Review", `<button class="btn secondary" onclick="showToast('Assessment summary exported (demo).')">↓ Export summary</button>`)}
    <div class="notice">
      <div class="spark">☷</div>
      <div>
        <strong>Assessment results, not AI recommendations</strong>
        This page summarizes assessments that managers, employees and peers have
        submitted. AI calibration suggestions are separate and live in
        <button class="btn ghost small" onclick="go('calibration')">
          AI Calibration →
        </button>
      </div>
    </div>
    ${adFilters(all, recs)}`;
  if (!recs.length)
    return `${top}<div class="card"><div class="empty">No employees match these filters.</div></div>`;
  return /* HTML */ `${top}
    <h3 class="ad-title">
      Organization overview${filtered ? " · filtered view" : ""}
    </h3>
    ${adOverview(all, recs)}
    <h3 class="ad-title">Assessment types</h3>
    ${adTypeCards(recs)}
    <div class="ad-stack">${adGradeChart(recs)}${adBreakdown(all, recs)}</div>`;
}
