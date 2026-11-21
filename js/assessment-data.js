// Assessment Dashboard data (HR): assessment types, performance grades and the
// employee roster behind the dashboard.
// Load order: after data.js (reuses `people` and `assessmentTasks`).

// prettier-ignore
const ASSESSMENT_TYPES = [
  { key: "down", label: "Manager assessment", sub: "Manager evaluating employees (Downward)", unit: "employees", noun: "manager assessments" },
  { key: "self", label: "Self assessment", sub: "Employees evaluating themselves", unit: "employees", noun: "self-assessments" },
  { key: "up", label: "Upward assessment", sub: "Employees evaluating their manager", unit: "responses", noun: "upward responses" },
  { key: "peer", label: "Peer assessment", sub: "Colleagues evaluating each other", unit: "employees", noun: "peer reviews" },
];

// Score bands on the 1-5 scale used everywhere else in the prototype.
// prettier-ignore
const GRADES = [
  { key: "outstanding", short: "Outstanding", label: "Outstanding", min: 4.5, range: "4.5 – 5.0" },
  { key: "exceeds", short: "Exceeds", label: "Exceeds Expectations", min: 4.0, range: "4.0 – 4.4" },
  { key: "meets", short: "Meets", label: "Meets Expectations", min: 3.0, range: "3.0 – 3.9" },
  { key: "needs", short: "Needs impr.", label: "Needs Improvement", min: 2.0, range: "2.0 – 2.9" },
  { key: "unsat", short: "Unsatisfactory", label: "Unsatisfactory", min: 0, range: "below 2.0" },
];

const LEVELS = ["Junior", "Mid", "Senior", "Lead", "Manager"];
const PEER_REVIEWS_PER_EMPLOYEE = 3; // each employee is assigned 3 peer reviewers
const MIN_UPWARD_RESPONSES = 3; // upward results are hidden below this (anonymity)
const SMALL_GROUP = 5; // groups smaller than this get a "small group" warning

// One row per employee in the FY2026 cycle (50 total, 41 with a manager assessment).
// [name, department, level, position, manager rating (downward), self, upward, peer avg, peer reviews]
// null = not completed yet. Upward = the employee's rating of their own manager.
// Rows for people already in `people` or `assessmentTasks` take their
// department / position / manager rating from those records (see assessmentRecords).
// prettier-ignore
const ASSESSMENT_ROSTER = [
  ["Arun Patel", "Engineering", "Mid", "Software Engineer", 4.8, 4.8, null, 4.9, 2],
  ["Sofia Garcia", "Engineering", "Mid", "Software Engineer", 2.5, 3.4, 3.9, 2.6, 3],
  ["James Wilson", "Engineering", "Manager", "Engineering Manager", 3.6, 3.9, null, 3.5, 1],
  ["Ravi Menon", "Engineering", "Senior", "Senior Software Engineer", 4.4, 4.8, 4.3, null, 0],
  ["Elena Petrov", "Engineering", "Senior", "Senior Software Engineer", 3.8, 4.1, null, 3.6, 3],
  ["Kenji Sato", "Engineering", "Mid", "DevOps Engineer", 3.4, 3.7, 4.5, 3.6, 3],
  ["Amara Okafor", "Engineering", "Mid", "QA Engineer", 3.5, 4, 4, 3.3, 2],
  ["Liam Murphy", "Engineering", "Junior", "Software Engineer", null, null, 3.9, 3.7, 3],
  ["Zoe Martin", "Engineering", "Junior", "Software Engineer", 3.2, 3.6, null, 3.1, 1],
  ["Tomas Novak", "Engineering", "Mid", "Data Engineer", 3.7, 4, 4.1, 3.9, 1],
  ["Aisha Rahman", "Engineering", "Lead", "Engineering Lead", 4.2, 4.2, 4, 4.2, 3],
  ["Diego Alvarez", "Engineering", "Senior", "Senior Software Engineer", 3.9, 4, 4, 3.8, 2],
  ["Wei Zhang", "Engineering", "Mid", "Software Engineer", 3.3, 3.6, null, 3.5, 1],
  ["Maya Chen", "Product & Design", "Senior", "Senior Product Designer", 4.5, 4.7, 4.7, 4.5, 3],
  ["Daniel Kim", "Product & Design", "Mid", "Product Designer", 3, 3.3, 4.7, 3.1, 2],
  ["Olivia Lee", "Product & Design", "Manager", "Design Manager", 3.8, 4, null, 4, 3],
  ["Lucas Moreau", "Product & Design", "Mid", "UX Researcher", 3.5, 3.6, null, 3.4, 1],
  ["Hana Kobayashi", "Product & Design", "Junior", "Product Designer", null, null, 4, null, 0],
  ["Samuel Okoye", "Product & Design", "Senior", "Product Manager", 3.7, 4.2, 4, 3.7, 1],
  ["Clara Jensen", "Product & Design", "Lead", "Design Lead", 4.3, 4.6, 3.9, 4.5, 3],
  ["Mateo Silva", "Product & Design", "Mid", "Content Designer", null, null, null, 3.4, 2],
  ["Yuki Tanaka", "Product & Design", "Mid", "Product Designer", 3.3, 3.4, 3.9, null, 0],
  ["Fatima Khan", "Product & Design", "Mid", "Product Manager", 3.4, 3.7, 4, 3.2, 3],
  ["Noah Williams", "Sales", "Mid", "Account Executive", 4, 4.4, 3.7, 4, 2],
  ["Priya Shah", "Sales", "Manager", "Sales Manager", 3.9, 3.9, null, 3.6, 3],
  ["Jack Turner", "Sales", "Junior", "Sales Development Rep", 2.7, 3.8, 3.7, 2.6, 3],
  ["Mia Andersson", "Sales", "Junior", "Sales Development Rep", 3.2, 3.3, 3.7, 3.4, 1],
  ["Carlos Ruiz", "Sales", "Senior", "Account Executive", 4.6, 5, 4.2, 4.4, 1],
  ["Emma Dubois", "Sales", "Mid", "Account Manager", 3.6, 4.1, null, 3.3, 3],
  ["Ahmed Farouk", "Sales", "Mid", "Account Executive", 3.5, 3.9, 4.4, 3.5, 3],
  ["Sophie Laurent", "Sales", "Senior", "Account Manager", 4.1, 4.2, 4.2, 4, 2],
  ["Oliver Grant", "Sales", "Junior", "Sales Development Rep", 3.1, 3.5, 4.1, 3, 3],
  ["Chloe Bennett", "Sales", "Mid", "Account Executive", 3.7, 4.1, null, 3.6, 1],
  ["Raj Malhotra", "Sales", "Lead", "Sales Lead", 3.8, 4.3, 4.5, 3.6, 3],
  ["Ines Costa", "Sales", "Mid", "Account Manager", 3.4, 3.7, 3.6, 3.7, 3],
  ["Taylor Reed", "Operations", "Manager", "Operations Manager", 3.8, 4, null, 3.9, 2],
  ["Chris Evans", "Operations", "Mid", "Operations Analyst", null, 4, null, 3.6, 3],
  ["Hannah Brooks", "Operations", "Junior", "Operations Coordinator", null, 4.1, 3.2, 3.8, 2],
  ["Marcus Bell", "Operations", "Mid", "Logistics Specialist", null, 3.8, 3.4, 3.9, 2],
  ["Grace Holloway", "Operations", "Lead", "Process Improvement Lead", null, 4.1, 4.1, 3.4, 3],
  ["Ethan Park", "Operations", "Mid", "Supply Planner", null, 4.1, null, 3.4, 3],
  ["Nina Rossi", "Operations", "Junior", "Operations Analyst", null, null, 3.3, null, 0],
  ["Lena Fischer", "Operations", "Senior", "Vendor Manager", 4, 4.1, 3.3, null, 0],
  ["Omar Haddad", "Operations", "Lead", "Warehouse Supervisor", 3, 3.3, 4.1, 2.8, 1],
  ["Victor Ng", "Operations", "Senior", "Operations Analyst", 4.2, 4.5, null, 4.2, 3],
  ["Layla Hassan", "Operations", "Junior", "Logistics Specialist", 2.4, 3.3, 4, 2.2, 2],
  ["Peter Lindqvist", "Operations", "Junior", "Warehouse Associate", 1.8, 2.8, 4.2, 1.6, 3],
  ["Aoife Byrne", "Operations", "Senior", "Supply Planner", 3.6, 3.7, 3.8, 3.5, 1],
  ["Jamal Carter", "Operations", "Mid", "Operations Coordinator", 3.3, 3.6, null, 3, 3],
  ["Sara Lindgren", "Operations", "Mid", "Vendor Manager", 3.5, 3.7, 3.5, null, 0],
];

function gradeOf(score) {
  return GRADES.find((g) => score >= g.min);
}

// Builds the employee records at call time, so a manager submitting an
// assessment in the Manager view is reflected here immediately.
function assessmentRecords() {
  return ASSESSMENT_ROSTER.map(
    ([name, dept, level, position, down, self, up, peer, peerN]) => {
      const p = people.find((x) => x.name === name);
      const t = assessmentTasks.find((x) => x.employee === name);
      if (p) ({ dept, role: position, rating: down } = p);
      if (t) {
        position = t.role;
        down = t.status === "submitted" ? t.rating : null;
      }
      return { name, dept, level, position, down, self, up, peer, peerN };
    },
  );
}

// ---------------------------------------------------------------------------
// Stats helpers
// ---------------------------------------------------------------------------

function avgOf(xs) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
}

// f = { dept, level, position }, each "all" or a value
function filterRecords(recs, f) {
  return recs.filter(
    (r) =>
      (f.dept === "all" || r.dept === f.dept) &&
      (f.level === "all" || r.level === f.level) &&
      (f.position === "all" || r.position === f.position),
  );
}

// Managers don't give an upward assessment in this demo (their own manager isn't in the roster).
function eligibleFor(recs, type) {
  return type === "up" ? recs.filter((r) => r.level !== "Manager") : recs;
}

function typeStats(recs, type) {
  const eligible = eligibleFor(recs, type);
  const done = eligible.filter((r) => r[type] != null);
  let assigned = eligible.length;
  let completed = done.length;
  let avg = avgOf(done.map((r) => r[type]));
  if (type === "peer") {
    // Peer: count individual reviews, and weight each employee's average by how many they received.
    assigned = eligible.length * PEER_REVIEWS_PER_EMPLOYEE;
    completed = done.reduce((n, r) => n + r.peerN, 0);
    avg = completed
      ? done.reduce((n, r) => n + r.peer * r.peerN, 0) / completed
      : null;
  }
  const hidden = type === "up" && completed < MIN_UPWARD_RESPONSES;
  const both = recs.filter((r) => r.self != null && r.down != null);
  return {
    assigned,
    completed,
    pct: assigned ? Math.round((completed / assigned) * 100) : 0,
    eligible: eligible.length,
    employees: done.length, // employees with at least one completed assessment of this type
    avg: hidden ? null : avg,
    hidden,
    selfGap: type === "self" ? avgOf(both.map((r) => r.self - r.down)) : null,
  };
}

function gradeCounts(recs, type) {
  const scores = eligibleFor(recs, type)
    .filter((r) => r[type] != null)
    .map((r) => r[type]);
  const total = scores.length;
  const hidden = type === "up" && total < MIN_UPWARD_RESPONSES;
  const items = GRADES.map((grade) => {
    const count = scores.filter((s) => gradeOf(s) === grade).length;
    return { grade, count, pct: total ? (count / total) * 100 : 0 };
  });
  return { total, items, hidden };
}

// dim: "dept" | "level" | "position"
function groupStats(recs, type, dim) {
  const rows = [...new Set(recs.map((r) => r[dim]))].map((key) => {
    const members = recs.filter((r) => r[dim] === key);
    return {
      key,
      size: members.length,
      ...typeStats(members, type),
      grades: gradeCounts(members, type),
    };
  });
  if (dim === "level")
    return rows.sort((a, b) => LEVELS.indexOf(a.key) - LEVELS.indexOf(b.key));
  if (dim === "position")
    return rows.sort((a, b) => b.size - a.size || a.key.localeCompare(b.key));
  return rows.sort((a, b) => a.key.localeCompare(b.key));
}
