// Manager / team assessments page.

function assessments() {
  if (state.role === "Manager") return managerAssessments();
  let manager = state.role === "Manager";
  return /* HTML */ `${head(manager ? "MANAGER WORKSPACE" : "ASSESSMENTS", "Team assessments", "Review your team using shared criteria and evidence-backed feedback.", /* HTML */ `<button class="btn secondary" onclick="showToast('Assessment guide opened (demo).')">Rating guide</button>`)}
    <div class="notice">
      <div class="spark">✳</div>
      <div>
        <strong>One review needs your attention</strong>Sofia Garcia’s
        assessment is missing evidence for one performance criterion.
      </div>
    </div>
    <div class="card">
      <div class="section-head">
        <div>
          <h2>${manager ? "My direct reports" : "Submitted assessments"}</h2>
          <div class="sub">FY2026 Annual Performance Review</div>
        </div>
        <span class="pill info">3 of 4 submitted</span>
      </div>
      ${people
        .slice(0, 4)
        .map(
          (p) =>
            /* HTML */ `<div class="review-row">
              <div class="person">
                <div class="mini-avatar">${initials(p.name)}</div>
                <div>
                  <b>${p.name}</b>
                  <div class="kpi">${p.role}</div>
                </div>
              </div>
              <div>
                <div class="kpi">Manager rating</div>
                <b>${p.rating.toFixed(1)} / 5</b>
              </div>
              <div>
                ${pill(p.name === "Sofia Garcia" ? "Evidence needed" : "Submitted")}
              </div>
              <div>
                <button
                  class="btn ghost small"
                  onclick="openPerson('${p.name}')"
                >
                  Open review →
                </button>
              </div>
            </div>`,
        )
        .join("")}
    </div>`;
}
