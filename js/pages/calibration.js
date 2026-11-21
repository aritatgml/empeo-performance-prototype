// AI calibration page, person review modal and audit history.

function calibration() {
  return /* HTML */ `${head("AI-ASSISTED REVIEW", "Calibration workspace", "AI highlights patterns for review. HR and managers retain final decision authority.", /* HTML */ `<button class="btn secondary" onclick="showToast('Calibration summary exported (demo).')">↓ Export summary</button>`)}
    <div class="notice">
      <div class="spark">✳</div>
      <div>
        <strong>Analysis complete · 5 employees analyzed</strong>Comparisons use
        role, job level, and relevant performance criteria. AI does not force a
        rating distribution or overwrite manager ratings.
      </div>
    </div>
    <div class="grid stats">
      ${cardStat("Suggestions to review", "2", "Require HR attention", "warning")}${cardStat("Evidence supported", "2", "No adjustment suggested", "positive")}${cardStat("Insufficient data", "1", "Human review required")}${cardStat("Average original rating", "3.8", "Submitted assessments")}
    </div>
    <div class="card">
      <div class="section-head">
        <div>
          <h2>Calibration recommendations</h2>
          <div class="sub">
            Suggested actions based on evidence and comparable roles
          </div>
        </div>
        <select class="role-select" onchange="filterCal(this.value)">
          <option value="all">All recommendations</option>
          <option value="Review needed">Review needed</option>
          <option value="Consistent">Consistent</option>
          <option value="Evidence supported">Evidence supported</option>
        </select>
      </div>
      <div id="calRows">${calRows("all")}</div>
    </div>
    <div class="grid two" style="margin-top:16px">
      <div class="card">
        <h2>How AI evaluates fairness</h2>
        <div class="sub">
          Signals are prompts for human review, not proof of bias.
        </div>
        <div style="margin-top:15px">
          <b>1. Rating pattern</b>
          <p class="sub">
            Looks for unusually lenient or strict patterns across comparable
            assessments.
          </p>
          <b>2. Evidence alignment</b>
          <p class="sub">
            Checks whether the written evidence supports the selected rating
            criteria.
          </p>
          <b>3. Context-aware comparison</b>
          <p class="sub">
            Uses job function, level, and relevant goals. Small groups are not
            force-compared.
          </p>
        </div>
      </div>
      <div class="card">
        <h2>Calibration guardrails</h2>
        <div style="margin-top:13px;line-height:2">
          <div>✓ Original manager rating is preserved</div>
          <div>✓ No forced ranking or fixed distribution</div>
          <div>✓ AI explains each recommendation</div>
          <div>✓ HR approval required for final rating</div>
          <div>✓ Every override is recorded</div>
        </div>
      </div>
    </div>`;
}

function calRows(f) {
  return (
    people
      .filter((p) => f === "all" || p.status === f)
      .map(
        (p) =>
          /* HTML */ `<div class="review-row">
            <div>
              <div class="person">
                <div class="mini-avatar">${initials(p.name)}</div>
                <div>
                  <b>${p.name}</b>
                  <div class="kpi">${p.role} · ${p.dept}</div>
                </div>
              </div>
            </div>
            <div>
              <div class="kpi">Manager rating</div>
              <div class="score">${p.rating.toFixed(1)} <small>/ 5</small></div>
            </div>
            <div>
              <div class="kpi">AI suggestion</div>
              <div class="score">
                ${p.suggest.toFixed(1)} <small>/ 5</small>
              </div>
            </div>
            <div>
              ${pill(p.status)}<br /><button
                class="btn ghost small"
                onclick="openPerson('${p.name}')"
              >
                Review →
              </button>
            </div>
          </div>`,
      )
      .join("") || '<div class="empty">No matching recommendations.</div>'
  );
}

function filterCal(v) {
  document.getElementById("calRows").innerHTML = calRows(v);
}

function openPerson(name) {
  let p = people.find((x) => x.name === name);
  state.selectedPerson = name;
  let suggested = p.suggest !== p.rating;
  let final = state.approved[name] ?? null;
  showModal(
    /* HTML */ `<div class="modal-head">
        <div>
          <div class="eyebrow">CALIBRATION REVIEW</div>
          <h2>${p.name}</h2>
          <div class="sub">${p.role} · ${p.dept} · Manager: ${p.manager}</div>
        </div>
        <button class="close" onclick="closeModal()">×</button>
      </div>
      <div class="grid three">
        <div class="card">
          <div class="kpi">Original rating</div>
          <div class="stat-value">${p.rating.toFixed(1)}</div>
        </div>
        <div class="card">
          <div class="kpi">AI suggestion</div>
          <div class="stat-value">${p.suggest.toFixed(1)}</div>
        </div>
        <div class="card">
          <div class="kpi">Final rating</div>
          <div class="stat-value">
            ${final === null ? "—" : Number(final).toFixed(1)}
          </div>
        </div>
      </div>
      <div style="margin-top:18px">
        <h3>Manager evidence</h3>
        <p class="sub">${p.evidence}</p>
      </div>
      <div class="notice" style="margin-top:16px">
        <div class="spark">✳</div>
        <div><strong>AI explanation</strong>${p.reason}</div>
      </div>
      <div class="callout">
        AI suggestion is advisory only. Review the evidence and context before
        making a decision. The original rating will remain in the audit history.
      </div>
      <div class="field">
        <label>Final rating</label
        ><select id="finalRating">
          <option value="${p.rating}" ${final === null ? "selected" : ""}>
            Keep original · ${p.rating.toFixed(1)}
          </option>
          <option
            value="${p.suggest}"
            ${final !== null && Number(final) === p.suggest ? "selected" : ""}
          >
            Use AI suggestion · ${p.suggest.toFixed(1)}
          </option>
          <option value="4">Set to 4.0</option>
          <option value="3">Set to 3.0</option>
          <option value="2">Set to 2.0</option>
        </select>
      </div>
      <div class="field">
        <label>Decision note (required when changing rating)</label
        ><textarea
          id="decisionNote"
          placeholder="Explain your decision and supporting context..."
        ></textarea>
      </div>
      <div class="actions">
        <button class="btn secondary" onclick="closeModal()">Cancel</button
        ><button class="btn" onclick="approveRating('${p.name}')">
          Save final decision
        </button>
      </div>`,
  );
}

function approveRating(name) {
  let p = people.find((x) => x.name === name),
    v = Number(document.getElementById("finalRating").value),
    note = document.getElementById("decisionNote").value.trim();
  if (v !== p.rating && !note) {
    showToast("Please add a decision note when changing the original rating.");
    return;
  }
  state.approved[name] = v;
  state.notices.push({
    name,
    old: p.rating,
    new: v,
    note: note || "Original rating retained",
    date: new Date().toLocaleString(),
  });
  closeModal();
  showToast("Final rating saved. Audit trail updated.");
  render();
}

function renderAudit() {
  let items = state.notices.slice().reverse();
  showModal(
    /* HTML */ `<div class="modal-head">
        <div>
          <div class="eyebrow">AUDIT HISTORY</div>
          <h2>Calibration decisions</h2>
        </div>
        <button class="close" onclick="closeModal()">×</button>
      </div>
      ${
        items.length
          ? items
              .map(
                (x) =>
                  /* HTML */ `<div class="risk">
                    <b>${x.name}: ${x.old.toFixed(1)} → ${x.new.toFixed(1)}</b>
                    <div class="muted">${x.note}</div>
                    <div class="kpi">${x.date}</div>
                  </div>`,
              )
              .join("")
          : '<div class="empty">No decisions recorded in this session yet.</div>'
      }`,
  );
}
