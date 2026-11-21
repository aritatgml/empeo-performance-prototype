// Manager assessment tasks: derived status, sorting, counts and completion.
// `assessmentTasks` (data.js) is the only place task state lives. Everything
// the Manager UI shows (counts, badges, lists) is computed from it here.

const DUE_SOON_DAYS = 3; // "Due soon" = due within the next 3 days (incl. today)
const DASHBOARD_TASK_LIMIT = 6; // rows shown on the dashboard before "View all"
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const URGENCY_RANK = { overdue: 0, "due-soon": 1, pending: 2 };

function dateValue(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

// Whole days from the demo "today" until `iso` (negative = already past).
function daysUntil(iso) {
  return Math.round((dateValue(iso) - dateValue(DEMO_TODAY)) / MS_PER_DAY);
}

function formatDate(iso, withYear = false) {
  return new Date(dateValue(iso)).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: withYear ? "numeric" : undefined,
    timeZone: "UTC",
  });
}

function plural(n, word) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

function firstName(name) {
  return name.split(" ")[0];
}

// "submitted" | "overdue" | "due-soon" | "pending"
function taskUrgency(task) {
  if (task.status === "submitted") return "submitted";
  const days = daysUntil(task.due);
  if (days < 0) return "overdue";
  if (days <= DUE_SOON_DAYS) return "due-soon";
  return "pending";
}

// Human-readable deadline note + css modifier for a task.
function deadlineLabel(task) {
  const urgency = taskUrgency(task);
  if (urgency === "submitted")
    return {
      text: `Submitted ${formatDate(task.submittedOn)}`,
      cls: "is-done",
    };
  const days = daysUntil(task.due);
  if (urgency === "overdue")
    return { text: `${plural(-days, "day")} overdue`, cls: "is-overdue" };
  if (days === 0) return { text: "Due today", cls: "is-due-soon" };
  if (days === 1) return { text: "Due tomorrow", cls: "is-due-soon" };
  if (urgency === "due-soon")
    return { text: `Due in ${days} days`, cls: "is-due-soon" };
  return { text: `In ${days} days`, cls: "is-pending" };
}

function managerTasks() {
  return assessmentTasks.filter((t) => t.manager === currentManager.name);
}

// Overdue first, then due soon, then the rest; earliest deadline first inside each group.
function byUrgency(a, b) {
  return (
    URGENCY_RANK[taskUrgency(a)] - URGENCY_RANK[taskUrgency(b)] ||
    dateValue(a.due) - dateValue(b.due) ||
    a.employee.localeCompare(b.employee)
  );
}

// filter: "all" (all pending) | "overdue" | "due-soon" | "completed"
function tasksForFilter(filter) {
  const tasks = managerTasks();
  if (filter === "completed") {
    return tasks
      .filter((t) => t.status === "submitted")
      .sort((a, b) => dateValue(b.submittedOn) - dateValue(a.submittedOn));
  }
  const pending = tasks.filter((t) => t.status !== "submitted").sort(byUrgency);
  return filter === "all"
    ? pending
    : pending.filter((t) => taskUrgency(t) === filter);
}

function taskStats() {
  const tasks = managerTasks();
  const pending = tasks.filter((t) => t.status !== "submitted");
  const overdue = pending
    .filter((t) => taskUrgency(t) === "overdue")
    .sort(byUrgency);
  const dueSoon = pending
    .filter((t) => taskUrgency(t) === "due-soon")
    .sort(byUrgency);
  const completed = tasks.length - pending.length;
  return {
    total: tasks.length,
    remaining: pending.length,
    overdue: overdue.length,
    dueSoon: dueSoon.length,
    completed,
    pct: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    overdueTasks: overdue,
    dueSoonTasks: dueSoon,
  };
}

function completeTask(id, rating, evidence) {
  const task = assessmentTasks.find((t) => t.id === id);
  if (!task || task.status === "submitted") return null;
  task.status = "submitted";
  task.submittedOn = DEMO_TODAY;
  task.rating = rating;
  task.evidence = evidence;
  return task;
}
