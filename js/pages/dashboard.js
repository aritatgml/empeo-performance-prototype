// Dashboard (HR overview).

function dashboard() {
  if (state.role === "Manager") return managerDashboard();
  return /* HTML */ `${head("PERFORMANCE MANAGEMENT", "Good morning, Alex", "Here’s where your organization stands in the FY2026 annual review cycle.", /* HTML */ `<button class="btn" onclick="go('cycles')">＋ Set up review cycle</button>`)}
    <div class="notice">
      <div class="spark">✳</div>
      <div>
        <strong>AI calibration is ready for HR review</strong>5 assessments have
        been submitted. 2 need attention before the cycle can be finalized.
        <button class="btn ghost small" onclick="go('calibration')">
          Review suggestions →
        </button>
      </div>
    </div>
    <div class="grid stats">
      ${cardStat("Review completion", "82%", "41 of 50 employees submitted", "positive")}${cardStat("Awaiting manager review", "6", "Across 3 departments", "warning")}${cardStat("AI flags to review", "2", "Potential rating inconsistencies", "negative")}${cardStat("Cycle deadline", "Dec 12", "12 days remaining")}
    </div>
    <div class="grid two">
      <div class="card">
        <div class="section-head">
          <div>
            <h2>Organization performance</h2>
            <div class="sub">Finalized and submitted ratings · demo data</div>
          </div>
          <button class="btn ghost small" onclick="go('people')">
            View people →
          </button>
        </div>
        <div style="display:flex;align-items:end;gap:25px">
          <div>
            <div class="stat-value">
              3.6<span style="font-size:13px;color:#6b6b7d"> / 5</span>
            </div>
            <div class="kpi">Average submitted rating</div>
          </div>
          <div style="flex:1">
            <div class="stack">
              <span style="width:8%"></span><span style="width:18%"></span
              ><span style="width:54%"></span><span style="width:20%"></span>
            </div>
            <div class="legend">
              <span
                ><i class="dot" style="background:#d6405a"></i>Needs improvement
                8%</span
              ><span
                ><i class="dot" style="background:#f5b83d"></i>Developing
                18%</span
              ><span
                ><i class="dot" style="background:#4c97ff"></i>Meets 54%</span
              ><span
                ><i class="dot" style="background:#00c291"></i>Exceeds 20%</span
              >
            </div>
          </div>
        </div>
        <div style="margin-top:24px">
          <div class="section-head">
            <b>Review progress by department</b
            ><span class="kpi">Submitted / total</span>
          </div>
          ${[
            ["Engineering", 92],
            ["Product & Design", 80],
            ["Sales", 75],
            ["Operations", 68],
          ]
            .map(
              (x) =>
                /* HTML */ `<div style="margin:12px 0">
                  <div
                    style="display:flex;justify-content:space-between;margin-bottom:6px"
                  >
                    <span>${x[0]}</span><b>${x[1]}%</b>
                  </div>
                  <div class="bar"><span style="width:${x[1]}%"></span></div>
                </div>`,
            )
            .join("")}
        </div>
      </div>
      <div class="card">
        <div class="section-head">
          <div>
            <h2>Needs your attention</h2>
            <div class="sub">Prioritized actions for HR</div>
          </div>
          <span class="pill amber">3 actions</span>
        </div>
        <div class="risk">
          <b>2 AI calibration suggestions</b>
          <div class="muted">
            Review potential rating inconsistencies before approval.
          </div>
          <button class="btn ghost small" onclick="go('calibration')">
            Open calibration →
          </button>
        </div>
        <div class="risk">
          <b>1 overdue manager review</b>
          <div class="muted">Operations · Chris Evans · 2 days overdue</div>
          <button class="btn ghost small" onclick="go('cycles')">
            Manage cycle →
          </button>
        </div>
        <div style="margin-top:18px">
          <h3>Cycle activity</h3>
          <div class="timeline">
            <div class="timeline-item">
              <b>Engineering submitted reviews</b>
              <div class="kpi">Today, 10:24 AM</div>
            </div>
            <div class="timeline-item">
              <b>AI analysis completed</b>
              <div class="kpi">Yesterday, 4:15 PM</div>
            </div>
            <div class="timeline-item">
              <b>Review cycle launched</b>
              <div class="kpi">Nov 1, 2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}
