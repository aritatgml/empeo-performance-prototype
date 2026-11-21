// Manager dashboard: urgency-first overview of outstanding assessments.
// Everything shown here is computed from `assessmentTasks` via taskStats().

const OVERDUE_ALERT_LIMIT = 5; // names listed in the alert before "+N more"

function managerStatCard({ label, value, foot, tone, filter }) {
  return /* HTML */ `<button
    class="card mstat ${tone}"
    onclick="goToTasks('${filter}')"
    aria-label="${label}: ${value}. View ${label.toLowerCase()}"
  >
    <span class="stat-label">${label}</span>
    <span class="stat-value">${value}</span>
    <span class="stat-foot">${foot}</span>
  </button>`;
}

function overdueAlert(s) {
  if (s.overdue) {
    const shown = s.overdueTasks.slice(0, OVERDUE_ALERT_LIMIT);
    const more = s.overdue - shown.length;
    return /* HTML */ `<section class="alert alert-overdue" role="alert">
      <div class="alert-icon">!</div>
      <div class="alert-body">
        <div class="alert-title">
          ${plural(s.overdue, "assessment")} ${s.overdue === 1 ? "is" : "are"}
          overdue
        </div>
        <ul class="overdue-list">
          ${shown
            .map(
              (t) =>
                `<li><b>${t.employee}</b><span class="days">${deadlineLabel(t).text}</span><span class="kpi">Due ${formatDate(t.due)}</span></li>`,
            )
            .join("")}
          ${more > 0 ? `<li class="kpi">+ ${more} more</li>` : ""}
        </ul>
      </div>
      <button class="btn solid-red" onclick="goToTasks('overdue')">
        Go to overdue reviews →
      </button>
    </section>`;
  }

  let title = "No overdue assessments";
  let sub = "You’re on track. Keep an eye on upcoming deadlines.";
  if (!s.remaining) {
    title = "All assessments submitted";
    sub = "Nothing left to do for this cycle. Great work!";
  } else if (s.dueSoon) {
    sub = `You’re on track, but ${plural(s.dueSoon, "assessment")} ${s.dueSoon === 1 ? "is" : "are"} due in the next ${DUE_SOON_DAYS} days.`;
  }
  return /* HTML */ `<section class="alert alert-ok">
    <div class="alert-icon">✓</div>
    <div class="alert-body">
      <div class="alert-title">${title}</div>
      <div class="sub">${sub}</div>
    </div>
    ${s.remaining ? `<button class="btn secondary" onclick="goToTasks('all')">View pending assessments →</button>` : ""}
  </section>`;
}

function managerDashboard() {
  const s = taskStats();
  const pending = tasksForFilter("all");
  const shown = pending.slice(0, DASHBOARD_TASK_LIMIT);
  const next = s.dueSoonTasks[0];
  const oldest = s.overdueTasks[0];

  return /* HTML */ `${head("MANAGER WORKSPACE", `Good morning, ${firstName(currentManager.name)}`, "Complete your team’s FY2026 assessments before their deadlines.")}
    ${overdueAlert(s)}
    <div class="grid stats">
      ${managerStatCard({
        label: "Remaining tasks",
        value: s.remaining,
        foot: `of ${plural(s.total, "assessment")} assigned`,
        tone: "neutral",
        filter: "all",
      })}
      ${managerStatCard({
        label: "Overdue",
        value: s.overdue,
        foot: oldest
          ? `Oldest was due ${formatDate(oldest.due)}`
          : "Nothing overdue",
        tone: s.overdue ? "overdue" : "zero",
        filter: "overdue",
      })}
      ${managerStatCard({
        label: "Due soon",
        value: s.dueSoon,
        foot: next
          ? `Next: ${next.employee} · ${formatDate(next.due)}`
          : `None in the next ${DUE_SOON_DAYS} days`,
        tone: s.dueSoon ? "due-soon" : "zero",
        filter: "due-soon",
      })}
      ${managerStatCard({
        label: "Completed",
        value: s.completed,
        foot: `${s.pct}% of your team submitted`,
        tone: "completed",
        filter: "completed",
      })}
    </div>
    <div class="card">
      <div class="section-head">
        <div>
          <h2>My Pending Assessments</h2>
          <div class="sub">
            Most urgent first · deadlines in the next ${DUE_SOON_DAYS} days are
            highlighted
          </div>
        </div>
        <button class="btn ghost small" onclick="goToTasks('all')">
          View all pending
          assessments${pending.length ? ` (${pending.length})` : ""} →
        </button>
      </div>
      ${shown.length ? taskList(shown) : emptyState(...TASK_EMPTY.all)}
      ${pending.length > shown.length ? `<div class="kpi task-more">Showing the ${shown.length} most urgent of ${pending.length}.</div>` : ""}
    </div>`;
}
