// Manager task list ("My assessments"), shared task components and the
// assessment form modal. Used by the Manager dashboard as well.

const TASK_FILTERS = [
  { key: "all", label: "All pending" },
  { key: "overdue", label: "Overdue" },
  { key: "due-soon", label: "Due soon" },
  { key: "completed", label: "Completed" },
];

const TASK_EMPTY = {
  all: [
    "All assessments submitted",
    "Nothing left to do. Great work keeping your team’s reviews on time.",
  ],
  overdue: [
    "No overdue assessments",
    "You’re on track — every pending review is still within its deadline.",
  ],
  "due-soon": [
    "Nothing due soon",
    `No assessments are due in the next ${DUE_SOON_DAYS} days.`,
  ],
  completed: [
    "No assessments submitted yet",
    "Submitted assessments will appear here.",
  ],
};

const RATING_OPTIONS = [
  [5, "Exceeds expectations"],
  [4, "Strong performance"],
  [3, "Meets expectations"],
  [2, "Developing"],
  [1, "Needs improvement"],
];

// ---- Navigation helpers ---------------------------------------------------

function goToTasks(filter = "all") {
  state.taskFilter = filter;
  go("assessments");
}

function setTaskFilter(filter) {
  state.taskFilter = filter;
  render();
}

// ---- Shared components ----------------------------------------------------

function taskStatusPill(urgency) {
  const [cls, label] = {
    overdue: ["red", "Overdue"],
    "due-soon": ["amber", "Due soon"],
    pending: ["", "Pending"],
    submitted: ["green", "Submitted"],
  }[urgency];
  return /* HTML */ `<span class="pill ${cls}">${label}</span>`;
}

function emptyState(title, sub) {
  return /* HTML */ `<div class="empty-state">
    <div class="empty-icon">✓</div>
    <b>${title}</b>
    <div class="sub">${sub}</div>
  </div>`;
}

function taskRow(task) {
  const urgency = taskUrgency(task);
  const note = deadlineLabel(task);
  const done = urgency === "submitted";
  return /* HTML */ `<div class="task-row ${urgency}">
    <div class="person">
      <div class="mini-avatar">${initials(task.employee)}</div>
      <div>
        <b>${task.employee}</b>
        <div class="kpi">${task.role}</div>
      </div>
    </div>
    <div class="task-type">
      <div>${task.type}</div>
      <div class="kpi">${task.cycle}</div>
    </div>
    <div class="task-deadline">
      <b>${formatDate(task.due)}</b>
      <div class="deadline-note ${note.cls}">${note.text}</div>
    </div>
    <div class="task-status">${taskStatusPill(urgency)}</div>
    <div class="task-action">
      <button
        class="btn small ${done ? "secondary" : ""}"
        onclick="openAssessment('${task.id}')"
      >
        ${done ? "View assessment" : "Continue Assessment"}
      </button>
    </div>
  </div>`;
}

function taskList(tasks) {
  return /* HTML */ `<div class="task-head">
      <div>Employee</div>
      <div>Assessment</div>
      <div>Deadline</div>
      <div>Status</div>
      <div></div>
    </div>
    <div class="task-list">${tasks.map(taskRow).join("")}</div>`;
}

// ---- Task list page -------------------------------------------------------

function managerAssessments() {
  const s = taskStats();
  const filter = TASK_FILTERS.some((f) => f.key === state.taskFilter)
    ? state.taskFilter
    : "all";
  const tasks = tasksForFilter(filter);
  const counts = {
    all: s.remaining,
    overdue: s.overdue,
    "due-soon": s.dueSoon,
    completed: s.completed,
  };
  const [emptyTitle, emptySub] = TASK_EMPTY[filter];
  const heading =
    filter === "completed" ? "Completed assessments" : "My Pending Assessments";
  const sub =
    filter === "completed"
      ? "Assessments you have already submitted."
      : "Sorted by urgency: overdue first, then due soon, then everything else.";

  return /* HTML */ `${head("MANAGER WORKSPACE", "My assessments", "Complete the outstanding reviews for your direct reports.", /* HTML */ `<button class="btn secondary" onclick="showToast('Assessment guide opened (demo).')">Rating guide</button>`)}
    <div class="card">
      <div class="tabs scroll" role="tablist">
        ${TASK_FILTERS.map(
          (f) =>
            /* HTML */ `<button
              class="${f.key === filter ? "active" : ""}"
              role="tab"
              aria-selected="${f.key === filter}"
              onclick="setTaskFilter('${f.key}')"
            >
              ${f.label}
              <span
                class="tab-count ${f.key === "overdue" && counts.overdue ? "has-overdue" : ""}"
                >${counts[f.key]}</span
              >
            </button>`,
        ).join("")}
      </div>
      <div class="section-head">
        <div>
          <h2>${heading}</h2>
          <div class="sub">${sub}</div>
        </div>
      </div>
      ${tasks.length ? taskList(tasks) : emptyState(emptyTitle, emptySub)}
    </div>`;
}

// ---- Assessment form modal ------------------------------------------------

function openAssessment(id) {
  const task = assessmentTasks.find((t) => t.id === id);
  if (!task) return;
  const urgency = taskUrgency(task);
  const done = urgency === "submitted";
  const note = deadlineLabel(task);
  const ratingOptions = RATING_OPTIONS.map(
    ([value, label]) =>
      `<option value="${value}" ${done && task.rating === value ? "selected" : ""}>${value} · ${label}</option>`,
  ).join("");

  showModal(
    /* HTML */ `<div class="modal-head">
        <div>
          <div class="eyebrow">MANAGER ASSESSMENT</div>
          <h2>${task.employee}</h2>
          <div class="sub">${task.role} · ${task.dept} · ${task.cycle}</div>
        </div>
        <button class="close" onclick="closeModal()">×</button>
      </div>
      <div class="deadline-banner ${urgency}">
        <span>Deadline: <b>${formatDate(task.due, true)}</b></span>
        <span class="deadline-note ${note.cls}">${note.text}</span>
      </div>
      <div class="field">
        <label>Overall rating</label>
        <select id="assessRating" ${done ? "disabled" : ""}>
          ${done ? "" : '<option value="">Select a rating…</option>'}${ratingOptions}
        </select>
      </div>
      <div class="field">
        <label>Evidence and feedback</label>
        <textarea
          id="assessEvidence"
          ${done ? "disabled" : ""}
          placeholder="Describe the outcomes and examples that support this rating..."
        >
${done ? escapeHtml(task.evidence) : ""}</textarea>
      </div>
      <div class="callout">
        Use the shared rating definitions and cite specific evidence. HR may
        review this assessment during calibration.
      </div>
      <div class="actions">
        <button class="btn secondary" onclick="closeModal()">
          ${done ? "Close" : "Cancel"}
        </button>
        ${done ? "" : `<button class="btn" onclick="submitAssessment('${task.id}')">Submit assessment</button>`}
      </div>`,
  );
}

function submitAssessment(id) {
  const rating = Number(document.getElementById("assessRating").value);
  const evidence = document.getElementById("assessEvidence").value.trim();
  if (!rating) {
    showToast("Please select an overall rating.");
    return;
  }
  if (!evidence) {
    showToast("Please add evidence to support the rating.");
    return;
  }
  const task = completeTask(id, rating, evidence);
  if (!task) return;
  closeModal();
  const left = taskStats().remaining;
  showToast(
    left
      ? `Assessment for ${task.employee} submitted. ${plural(left, "task")} remaining.`
      : `Assessment for ${task.employee} submitted. All assessments complete!`,
  );
  render();
}
