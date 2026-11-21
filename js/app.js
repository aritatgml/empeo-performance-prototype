// Entry point: navigation, role switching and page rendering.

function go(p) {
  state.page = p;
  render();
}

document.getElementById("nav").addEventListener("click", (e) => {
  let b = e.target.closest("button[data-page]");
  if (b) {
    state.taskFilter = "all"; // opening "My assessments" from the nav always starts unfiltered
    go(b.dataset.page);
  }
});

document.getElementById("role").addEventListener("change", (e) => {
  state.role = e.target.value;
  if (state.role === "Manager") state.page = "dashboard"; // Manager lands on their dashboard
  render();
});

// Sidebar identity, demo-date note and task badge follow the selected role.
// HR and Employee keep the original "Alex Morgan / HR Administrator" identity.
function renderRoleChrome() {
  const manager = state.role === "Manager";
  document.getElementById("profileAvatar").textContent = manager
    ? initials(currentManager.name)
    : "HR";
  document.getElementById("profileName").textContent = manager
    ? currentManager.name
    : "Alex Morgan";
  document.getElementById("profileTitle").textContent = manager
    ? currentManager.title
    : "HR Administrator";
  document.getElementById("demoNote").textContent = manager
    ? `Demo workspace · Today: ${formatDate(DEMO_TODAY, true)}`
    : "Demo workspace";

  const navBtn = document.querySelector('.nav button[data-page="assessments"]');
  let badge = navBtn.querySelector(".nav-badge");
  if (!manager) {
    if (badge) badge.remove();
    return;
  }
  const s = taskStats();
  if (!badge) {
    badge = document.createElement("span");
    badge.className = "nav-badge";
    navBtn.appendChild(badge);
  }
  badge.textContent = s.remaining;
  badge.hidden = s.remaining === 0;
  badge.classList.toggle("has-overdue", s.overdue > 0);
  badge.title = s.overdue
    ? `${s.remaining} remaining, ${s.overdue} overdue`
    : `${s.remaining} remaining`;
}

function render() {
  // Resolve role restrictions first so the nav highlight and breadcrumb match the page shown.
  if (
    state.role === "Employee" &&
    ["dashboard", "cycles", "calibration"].includes(state.page)
  )
    state.page = "people";
  // The Assessment dashboard is HR-only.
  if (state.role !== "HR" && state.page === "assessmentDash")
    state.page = state.role === "Manager" ? "dashboard" : "people";
  document.querySelector('.nav button[data-page="assessmentDash"]').hidden =
    state.role !== "HR";
  document
    .querySelectorAll(".nav button")
    .forEach((b) =>
      b.classList.toggle("active", b.dataset.page === state.page),
    );
  document.getElementById("crumb").textContent = {
    dashboard: "Overview",
    cycles: "Review cycles",
    assessmentDash: "Assessment dashboard",
    calibration: "AI Calibration",
    assessments: "My assessments",
    people: "People & results",
  }[state.page];
  renderRoleChrome();
  const pages = {
    dashboard: dashboard,
    cycles: cycles,
    assessmentDash: assessmentDashboard,
    calibration: calibration,
    assessments: assessments,
    people: peoplePage,
  };
  document.getElementById("view").innerHTML = pages[state.page]();
}

render();
