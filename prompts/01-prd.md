# Stage 1 — PRD creation and requirements

## Explanatory note (not an original prompt)

The initial assignment prompt was split across messages. The following ten original messages are preserved separately in chronological order, including the consolidation request and subsequent additions from the same PRD stage.

## Original prompt — message 1

```text
I am a third-year Management and Technology student taking a Generative AI course.Help me build an interactive presentation for a course assignment.Project title:"The Smart Warehouse: The Journey of an Order in the Age of AI"The presentation must contain exactly 10 slides, written in Hebrew with right-to-left layout.For this first step, create only a file named prd.md.Do not implement the presentation yet.Write the PRD in English, while keeping the proposed slide titles and presentation content in Hebrew.Assignment deliverables:- An interactive 10-slide presentation.- JavaScript-powered animation and a meaningful 3D element.- A GitHub repository containing the project source code.- README.md describing the repository, presentation specifications, workflow, and setup instructions.- Several actual presentation screenshots embedded in README.md.- prd.md containing a checklist of all planned requirements.- A separate file containing the actual conversations with Codex.Planned implementation:- HTML, CSS, and JavaScript using Vite.- Three.js for the 3D warehouse.- A browser-based slide presentation.- No backend or paid API required.- No Python unless a specific need arises.Presentation requirements:- Exactly 10 slides.- Hebrew text and RTL layout.- Readable typography and concise content.- Previous and next buttons, keyboard navigation, a slide counter, and a fullscreen button.- A small 3D warehouse with shelves, products, aisles, and an animated robot.
```

## Original prompt — message 2

```text
- Display a clear message when no valid route exists.
- Clearly label simulated data as demonstration data.
- Explain the distinction between automation, pathfinding algorithms, and AI.
- Do not claim that the demonstration uses a trained AI model.

Slide outline:
1. Introduction: What happens after we place an order?
2. Challenges in a traditional warehouse.
3. What makes a warehouse smart?
4. Follow one sample order through the warehouse.
5. Compare two picking routes.
6. Demand forecasting and product placement.
7. Interactive demonstration: Choose an order.
8. Handling a blocked aisle.
9. Benefits, limitations, and the human role.
10. How the project was built with Codex and what I learned.

For each slide, specify:
- Its purpose.
- A proposed Hebrew title.
- Brief proposed Hebrew content.
- Its visual or interactive element.
- Acceptance criteria.

Include a Markdown checklist covering the slides, functionality, documentation, screenshots, conversation evidence, and final verification.

Separate required assignment deliverables from optional enhancements.
Leave all implementation checklist items unchecked.

Do not fabricate screenshots, sources, test results, or conversation transcripts.
Actual conversation evidence will be saved separately from the original session.

After creating prd.md, summarize the plan in simple English and stop so I can review it.
```

## Original prompt — message 3

```text
- Three predefined orders for the audience to choose from.
```

## Original prompt — message 4

```text
- Highlight the products in the selected order.
```

## Original prompt — message 5

```text
- Start, pause, resume, and reset controls.
```

## Original prompt — message 6

```text
My original prompt was accidentally split into several messages. Treat all of them as one complete request.

Review prd.md against all the requirements I sent and add anything missing. Create the file if it does not exist.

For now, create or update only prd.md. Do not build the presentation yet.

Confirm that the plan contains exactly 10 slides, all the requested interactive features, and the assignment deliverables. Then summarize the plan and stop.
```

## Original prompt — message 7

```text
- Animate the robot along a valid picking route.
```

## Original prompt — message 8

```text
- Show route length in clearly labeled demonstration units.
```

## Original prompt — message 9

```text
- Allow blocking one predefined aisle and calculate an alternative route.
```

## Original prompt — message 10

```text
- The robot must not pass through shelves or blocked aisles.
```
