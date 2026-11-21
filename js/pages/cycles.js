// Review cycles page, cycle setup and exception handling modals.

function cycles() {
  return /* HTML */ `${head("WORKFLOW MANAGEMENT", "Review cycles", "Set up review periods, monitor completion, and handle exceptions.", /* HTML */ `<button class="btn" onclick="openSetup()">＋ Create cycle</button>`)}
    <div class="grid stats">
      ${cardStat("Active cycles", "1", "FY2026 Annual Review")}${cardStat("Employees in cycle", "50", "Across 4 departments")}${cardStat("Submitted", "41", "82% completion", "positive")}${cardStat("Overdue", "1", "Action required", "warning")}
    </div>
    <div class="card">
      <div class="section-head">
        <div>
          <h2>FY2026 Annual Performance Review</h2>
          <div class="sub">Nov 1 – Dec 12, 2026 · Company-wide</div>
        </div>
        ${pill("In progress")}
      </div>
      <div class="bar" style="height:10px;margin:17px 0">
        <span style="width:82%"></span>
      </div>
      <div class="legend">
        <span>41 submitted</span><span>6 in progress</span
        ><span>2 not started</span><span>1 overdue</span>
      </div>
      <div class="tabs" style="margin-top:20px">
        <button class="active" onclick="cycleTab('all',this)">
          All employees</button
        ><button onclick="cycleTab('overdue',this)">Overdue (1)</button
        ><button onclick="cycleTab('pending',this)">Pending (8)</button>
      </div>
      <div id="cycleTable">${cycleTable("all")}</div>
    </div>
    <div class="grid two" style="margin-top:16px">
      <div class="card">
        <h2>Exception handling</h2>
        <div class="sub">Keep the cycle moving when plans change.</div>
        <div class="risk">
          <b>Chris Evans · Operations</b>
          <div class="muted">Manager review is 2 days overdue.</div>
          <div style="display:flex;gap:8px;margin-top:9px">
            <button class="btn small" onclick="extendDeadline()">
              Extend deadline</button
            ><button class="btn secondary small" onclick="reassign()">
              Reassign reviewer
            </button>
          </div>
        </div>
      </div>
      <div class="card">
        <h2>Cycle timeline</h2>
        <div class="timeline">
          <div class="timeline-item">
            <b>Self-assessment</b>
            <div class="kpi">Nov 1 – Nov 15 · Completed</div>
          </div>
          <div class="timeline-item">
            <b>Manager assessment</b>
            <div class="kpi">Nov 16 – Dec 5 · In progress</div>
          </div>
          <div class="timeline-item">
            <b>Calibration & approval</b>
            <div class="kpi">Dec 6 – Dec 12 · Upcoming</div>
          </div>
        </div>
      </div>
    </div>`;
}

function cycleTable(filter) {
  let rows = [
    ["Maya Chen", "Product & Design", "Olivia Lee", "Submitted"],
    ["Daniel Kim", "Product & Design", "Olivia Lee", "Submitted"],
    ["Arun Patel", "Engineering", "James Wilson", "Submitted"],
    ["Sofia Garcia", "Engineering", "James Wilson", "In progress"],
    ["Chris Evans", "Operations", "Taylor Reed", "Overdue"],
  ];
  if (filter === "overdue") rows = rows.filter((r) => r[3] === "Overdue");
  if (filter === "pending") rows = rows.filter((r) => r[3] !== "Submitted");
  return /* HTML */ `<div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Employee</th>
          <th>Department</th>
          <th>Reviewer</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (r) =>
              /* HTML */ `<tr>
                <td>
                  <div class="person">
                    <div class="mini-avatar">${initials(r[0])}</div>
                    <b>${r[0]}</b>
                  </div>
                </td>
                <td>${r[1]}</td>
                <td>${r[2]}</td>
                <td>${pill(r[3])}</td>
                <td class="right">
                  ${r[3] === "Overdue" ? /* HTML */ `<button class="btn ghost small" onclick="extendDeadline()">Resolve</button>` : '<span class="muted">—</span>'}
                </td>
              </tr>`,
          )
          .join("")}
      </tbody>
    </table>
  </div>`;
}

function cycleTab(f, b) {
  document
    .querySelectorAll(".tabs button")
    .forEach((x) => x.classList.remove("active"));
  b.classList.add("active");
  document.getElementById("cycleTable").innerHTML = cycleTable(f);
}

function cyclePage() {
  go("cycles");
}

function openSetup() {
  showModal(
    /* HTML */ `<div class="modal-head">
        <div>
          <div class="eyebrow">NEW REVIEW CYCLE</div>
          <h2>Set up a review cycle</h2>
          <div class="sub">
            Configure the review period and shared rating framework.
          </div>
        </div>
        <button class="close" onclick="closeModal()">×</button>
      </div>
      <div class="field">
        <label>Cycle name</label
        ><input id="newCycle" value="FY2027 Annual Performance Review" />
      </div>
      <div class="form-grid">
        <div class="field">
          <label>Start date</label><input type="date" value="2027-01-04" />
        </div>
        <div class="field">
          <label>End date</label><input type="date" value="2027-02-15" />
        </div>
      </div>
      <div class="field">
        <label>Included employees</label
        ><select>
          <option>All active employees (50)</option>
          <option>Selected departments</option>
        </select>
      </div>
      <div class="field">
        <label>Rating scale</label
        ><select>
          <option>5-point standardized scale</option>
        </select>
      </div>
      <div class="callout">
        The cycle will use shared rating definitions and require evidence for
        each selected performance criterion.
      </div>
      <div class="actions">
        <button class="btn secondary" onclick="closeModal()">Cancel</button
        ><button class="btn" onclick="createCycle()">Create draft cycle</button>
      </div>`,
  );
}

function createCycle() {
  let n = document.getElementById("newCycle").value.trim();
  if (!n) {
    showToast("Enter a cycle name.");
    return;
  }
  state.cycleName = n;
  closeModal();
  showToast("Draft cycle created (demo).");
  go("cycles");
}

function extendDeadline() {
  showModal(
    /* HTML */ `<div class="modal-head">
        <div>
          <div class="eyebrow">EXCEPTION HANDLING</div>
          <h2>Extend review deadline</h2>
        </div>
        <button class="close" onclick="closeModal()">×</button>
      </div>
      <p class="sub">
        Chris Evans · Operations · Manager review overdue by 2 days.
      </p>
      <div class="field">
        <label>New deadline</label
        ><input id="deadline" type="date" value="2026-12-08" />
      </div>
      <div class="field">
        <label>Reason</label
        ><textarea
          id="extendReason"
          placeholder="e.g. Manager is on approved leave..."
        ></textarea>
      </div>
      <div class="actions">
        <button class="btn secondary" onclick="closeModal()">Cancel</button
        ><button
          class="btn"
          onclick="closeModal();showToast('Deadline extended and audit event recorded (demo).')"
        >
          Confirm extension
        </button>
      </div>`,
  );
}

function reassign() {
  showModal(
    /* HTML */ `<div class="modal-head">
        <div>
          <div class="eyebrow">EXCEPTION HANDLING</div>
          <h2>Reassign reviewer</h2>
        </div>
        <button class="close" onclick="closeModal()">×</button>
      </div>
      <p class="sub">Chris Evans · Operations</p>
      <div class="field">
        <label>New reviewer</label
        ><select id="newReviewer">
          <option>Taylor Reed</option>
          <option>Alex Morgan</option>
          <option>Jordan Blake</option>
        </select>
      </div>
      <div class="field">
        <label>Reason for reassignment</label
        ><textarea placeholder="Add context for the audit trail..."></textarea>
      </div>
      <div class="actions">
        <button class="btn secondary" onclick="closeModal()">Cancel</button
        ><button
          class="btn"
          onclick="closeModal();showToast('Reviewer reassigned and audit event recorded (demo).')"
        >
          Confirm reassignment
        </button>
      </div>`,
  );
}
