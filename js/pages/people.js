// People & results page (HR view and employee view).

function peoplePage() {
  if (state.role === "Employee")
    return /* HTML */ `${head("MY PERFORMANCE", "Your performance summary", "Your review, feedback, and development goals in one place.")}
      <div class="notice">
        <div class="spark">✦</div>
        <div>
          <strong>Your review is in progress</strong>Your manager is preparing
          feedback. You’ll be notified when your final review is available.
        </div>
      </div>
      <div class="grid two">
        <div class="card">
          <h2>My goals</h2>
          <p class="sub">FY2026 goals agreed with your manager</p>
          <div style="margin-top:18px">
            <b>Improve product onboarding experience</b>
            <p class="sub">
              Target: improve activation by 10% · Status: Achieved
            </p>
            <div class="bar"><span style="width:100%"></span></div>
          </div>
          <div style="margin-top:18px">
            <b>Strengthen cross-functional collaboration</b>
            <p class="sub">
              Target: lead 2 design reviews · Status: In progress
            </p>
            <div class="bar"><span style="width:70%"></span></div>
          </div>
        </div>
        <div class="card">
          <h2>Development plan</h2>
          <p class="sub">Suggested next steps from your last check-in</p>
          <div class="risk">Advanced product analytics workshop</div>
          <div class="risk">Mentorship and leadership development</div>
        </div>
      </div>`;
  return /* HTML */ `${head("PEOPLE ANALYTICS", "People & performance results", "Understand performance in context — not just as a single score.", /* HTML */ `<button class="btn secondary" onclick="showToast('People report exported (demo).')">↓ Export report</button>`)}
    <div class="grid stats">
      ${cardStat("High performers", "20%", "Exceeds expectations", "positive")}${cardStat("Meeting expectations", "54%", "Consistent delivery")}${cardStat("Needs development", "8%", "Support and action plans", "warning")}${cardStat("Average rating", "3.6", "Across submitted reviews")}
    </div>
    <div class="card">
      <div class="section-head">
        <div>
          <h2>Employee performance</h2>
          <div class="sub">
            Illustrative demo data · Final ratings require approval
          </div>
        </div>
        <input
          placeholder="Search employees..."
          style="max-width:220px;border:1px solid var(--line);padding:9px;border-radius:8px"
          oninput="searchPeople(this.value)"
        />
      </div>
      <div id="peopleRows">${peopleRows("")}</div>
    </div>`;
}

function peopleRows(q) {
  return (
    people
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.dept.toLowerCase().includes(q.toLowerCase()),
      )
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
              <div class="kpi">Department</div>
              <b>${p.dept}</b>
            </div>
            <div>
              <div class="kpi">Current rating</div>
              <b>${p.rating.toFixed(1)} / 5</b>
            </div>
            <div>
              <button class="btn ghost small" onclick="openPerson('${p.name}')">
                View details →
              </button>
            </div>
          </div>`,
      )
      .join("") || '<div class="empty">No employees found.</div>'
  );
}

function searchPeople(q) {
  document.getElementById("peopleRows").innerHTML = peopleRows(q);
}
