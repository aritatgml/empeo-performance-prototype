// Application state and demo data.

const state = {
  page: "dashboard",
  role: "HR",
  approved: {},
  cycleStatus: "In progress",
  cycleName: "FY2026 Annual Performance Review",
  selectedPerson: "Maya Chen",
  ratings: {},
  notices: [],
  taskFilter: "all", // Manager task list filter: all | overdue | due-soon | completed
};

const people = [
  {
    name: "Maya Chen",
    role: "Senior Product Designer",
    dept: "Product & Design",
    manager: "Olivia Lee",
    rating: 4.5,
    suggest: 4.2,
    status: "Review needed",
    evidence:
      "Led the redesign of the customer onboarding journey, improving activation by 18%. Mentored two designers and introduced a shared design QA checklist.",
    reason:
      "The manager rating is above the comparable group. Evidence strongly supports an exceeds-expectations outcome, but the impact aligns more closely with level 4 criteria than level 5.",
  },
  {
    name: "Daniel Kim",
    role: "Product Designer",
    dept: "Product & Design",
    manager: "Olivia Lee",
    rating: 3.0,
    suggest: 3.0,
    status: "Consistent",
    evidence:
      "Delivered core design tasks on schedule and collaborated with engineering. Two usability findings were addressed before release.",
    reason:
      "Rating is consistent with the role-level comparison group and the submitted evidence.",
  },
  {
    name: "Arun Patel",
    role: "Software Engineer",
    dept: "Engineering",
    manager: "James Wilson",
    rating: 4.8,
    suggest: 4.8,
    status: "Evidence supported",
    evidence:
      "Reduced API response time by 32%, resolved two critical production incidents, and improved automated test coverage.",
    reason:
      "Strong measurable outcomes support the original rating. No adjustment is recommended.",
  },
  {
    name: "Sofia Garcia",
    role: "Software Engineer",
    dept: "Engineering",
    manager: "James Wilson",
    rating: 2.5,
    suggest: 3.0,
    status: "Review needed",
    evidence:
      "Completed assigned sprint work but missed two delivery milestones due to dependencies. Helped document service ownership.",
    reason:
      "The manager rating is lower than comparable peers. Context indicates delivery delays were partly caused by cross-team dependencies; review the evidence before finalizing.",
  },
  {
    name: "Noah Williams",
    role: "Account Executive",
    dept: "Sales",
    manager: "Priya Shah",
    rating: 4.0,
    suggest: 4.0,
    status: "Consistent",
    evidence:
      "Achieved 108% of annual quota and maintained a healthy renewal pipeline.",
    reason: "Results align with the defined sales performance criteria.",
  },
];

// ---------------------------------------------------------------------------
// Manager workspace demo data
// ---------------------------------------------------------------------------

// Fixed "today" so the demo deadlines always make sense (matches the HR
// dashboard: cycle ends Dec 12 = 12 days remaining). Change it to move the demo.
const DEMO_TODAY = "2026-11-30";

// The manager shown when the role switcher is set to "Manager".
// Taylor Reed is the reviewer of the overdue Operations review on the HR side.
const currentManager = {
  name: "Taylor Reed",
  title: "Operations Manager",
  dept: "Operations",
};

// Single source of truth for manager assessment tasks.
// Only `status` is stored ("pending" | "submitted"). Overdue / due-soon is
// always derived from `due` vs DEMO_TODAY (see js/tasks.js).
const assessmentTasks = [
  {
    id: "t1",
    employee: "Chris Evans",
    role: "Operations Analyst",
    dept: "Operations",
    manager: "Taylor Reed",
    cycle: "FY2026 Annual Review",
    type: "Manager assessment",
    due: "2026-11-28",
    status: "pending",
  },
  {
    id: "t2",
    employee: "Hannah Brooks",
    role: "Operations Coordinator",
    dept: "Operations",
    manager: "Taylor Reed",
    cycle: "FY2026 Annual Review",
    type: "Manager assessment",
    due: "2026-12-01",
    status: "pending",
  },
  {
    id: "t3",
    employee: "Marcus Bell",
    role: "Logistics Specialist",
    dept: "Operations",
    manager: "Taylor Reed",
    cycle: "FY2026 Annual Review",
    type: "Manager assessment",
    due: "2026-12-03",
    status: "pending",
  },
  {
    id: "t4",
    employee: "Grace Holloway",
    role: "Process Improvement Lead",
    dept: "Operations",
    manager: "Taylor Reed",
    cycle: "FY2026 Annual Review",
    type: "Manager assessment",
    due: "2026-12-04",
    status: "pending",
  },
  {
    id: "t5",
    employee: "Ethan Park",
    role: "Supply Planner",
    dept: "Operations",
    manager: "Taylor Reed",
    cycle: "FY2026 Annual Review",
    type: "Manager assessment",
    due: "2026-12-05",
    status: "pending",
  },
  {
    id: "t6",
    employee: "Nina Rossi",
    role: "Operations Analyst",
    dept: "Operations",
    manager: "Taylor Reed",
    cycle: "FY2026 Annual Review",
    type: "Manager assessment",
    due: "2026-12-05",
    status: "pending",
  },
  {
    id: "t7",
    employee: "Lena Fischer",
    role: "Vendor Manager",
    dept: "Operations",
    manager: "Taylor Reed",
    cycle: "FY2026 Annual Review",
    type: "Manager assessment",
    due: "2026-11-27",
    status: "submitted",
    submittedOn: "2026-11-24",
    rating: 4,
    evidence:
      "Renegotiated two vendor contracts, saving 9% on annual spend, and onboarded the new freight partner ahead of schedule.",
  },
  {
    id: "t8",
    employee: "Omar Haddad",
    role: "Warehouse Supervisor",
    dept: "Operations",
    manager: "Taylor Reed",
    cycle: "FY2026 Annual Review",
    type: "Manager assessment",
    due: "2026-11-27",
    status: "submitted",
    submittedOn: "2026-11-26",
    rating: 3,
    evidence:
      "Met fulfilment targets each quarter and improved pick accuracy. Safety audit actions were closed on time.",
  },
];
