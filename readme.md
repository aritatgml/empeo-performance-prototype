# empeo Performance Management

**Product Owner Take-home Exam — Gofive**

## Live Demo

https://aritatgml.github.io/empeo-performance-prototype/

## Overview

A clickable prototype of a Performance Management feature for empeo.

## Key Features

- Review cycle management
- Manager assessment tasks and deadline tracking
- Evidence-based performance assessments
- AI-assisted performance calibration
- Human review and approval of calibration recommendations
- Employee performance results and feedback
- Handling of overdue assessments and review exceptions

## How to Use

1. Open the live demo.
2. Use the role switcher to explore HR Admin, Manager, and Employee experiences.
3. Navigate through the available screens and interact with the main workflows.

*Note: This is a prototype using mock data. AI recommendations are simulated and are not connected to a real AI service.*

---

# Part 2 — Product Thinking

## 1. Scope & Prioritization

I identified three main problems affecting different user roles:

**1. Managers: Late performance reviews**

I approached this from both prevention and recovery.

- To prevent delays, managers can see their pending assessment tasks, workload, and deadlines directly on their dashboard. Reminders and clear task priorities help them plan their work.
- When a deadline is missed, both managers and HR are notified. HR can then extend the deadline or reassign the assessment to another manager.

**2. Employees: Lack of visibility into their goals and performance**

Employees should be able to see their KPIs and understand what they are expected to achieve throughout the review cycle.

**3. Inconsistent performance ratings across managers**

I addressed this through standardized rating criteria and measurable KPIs, supported by evidence-based assessments.

For calibration, I explored how organizations typically align performance ratings. This often involves managers preparing supporting evidence and discussing their ratings together across teams. While I believe human discussion is still valuable, preparing for these meetings can be time-consuming.

Therefore, I introduced AI-assisted calibration to reduce the preparation effort. AI can analyze rating patterns, check whether ratings are supported by evidence, summarize the reasons behind ratings, and flag potential inconsistencies across comparable groups based on job function, job level, and performance criteria.

However, AI should not make final performance decisions. Performance evaluation involves context that may not be fully captured by measurable data.

**What I deliberately left out**

For V1, I deliberately avoided fully automated AI rating adjustments, forced ranking or forced rating distributions, and predictive performance scoring. I also did not attempt to replace calibration discussions entirely with AI.

I also want the employees to record their weekly progress and achievements, so they have evidence of their contributions when the review takes place.

**Would I ship this to a real customer next week?**

I wouldn't consider it ready for a real customer yet.

After reviewing the prototype, I realized that some screens contain too much information, making the main actions and workflows difficult to understand. Before shipping, I would simplify the UI and improve the information hierarchy.

I would also want to validate several assumptions with customers before finalizing the requirements.

## 2. Requirement Changes

I believe my original design can accommodate this change quite well because I had already considered the importance of performance calibration when designing the AI-assisted calibration feature.

To accommodate this change, I would introduce a collaborative calibration workspace where managers can review and discuss ratings across teams using AI-generated insights and supporting evidence. I would also add calibration statuses, such as "Calibration in Progress" and "Calibration Locked". Employee results would remain hidden until HR locks the calibration, after which the final ratings would be published.

**How would I measure success?**

- **Fairness:** Reduce unexplained differences in rating patterns across comparable groups.
- **Efficiency:** Reduce the time HR and managers spend preparing for calibration meetings and the overall time required to complete calibration.
- **Usefulness:** Share of AI suggestions HR judged to be well-reasoned.
- **Transparency:** Ensure every rating adjustment has a documented reason.
- **Adoption:** Track the percentage of AI recommendations reviewed by HR and managers.

## 3. Working with AI

Initially, I thought performance calibration meetings could be very time-consuming, so my first question was: "Could we use AI to handle calibration?"

I thought that if we had clear and measurable KPIs, AI could potentially handle rating adjustments automatically. However, the AI suggested a more cautious approach: using AI to assist with calibration rather than allowing it to make all the decisions.

Then I realized that if employees found out that their ratings had been lowered because of AI, they wouldn't be pleased. Ultimately, employees want to be evaluated with human empathy and understanding.# empeo-performance-prototype
