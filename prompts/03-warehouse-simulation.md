# Stage 3 — Three.js warehouse and simulation

## Original prompt — message 1

```text
The presentation opens successfully in my browser, and the first slide looks good.

Now implement the 3D warehouse and interactive simulation described in prd.md. Preserve the existing design, Hebrew RTL content, navigation, and exactly 10 slides.

Use Three.js with simple geometric models:
- Shelves with colored products.
- Clearly visible aisles and a packing station.
- A recognizable robot with smooth movement.
- Good lighting and an angled camera showing the entire warehouse.

Replace the relevant 3D placeholders with working scenes.
Use a static warehouse overview on the opening slide.
Put the main interactive demonstration on slide 7 and the blocked-aisle demonstration on slide 8.

Implement:
- Three predefined orders with highlighted target products.
- Start, pause, resume, and reset controls with Hebrew labels.
- A visible picking route and its length in demonstration units.
- Valid pathfinding through aisles, never through shelves.
- Product collection from accessible positions beside shelves.
- Return to the packing station after collecting all items.
- A toggle that blocks one predefined aisle and recalculates the route.
- At least one order whose route visibly changes when that aisle is blocked.
- A clear Hebrew message if no valid route exists.

Keep the simulation state and controls consistent when switching slides.
Pause movement when leaving an interactive slide.
Handle resizing and fullscreen correctly.
Clearly label this as an educational simulation using a pathfinding algorithm, not a trained AI model.

Use npm.cmd for commands. Do not change PowerShell execution policy.
Run the production build and meaningful checks for route validity and simulation controls.
If browser testing is unavailable, report that honestly and provide a short manual checklist.

Update README.md and the PRD checklist to reflect only what was actually implemented and verified.
Do not fabricate screenshots or conversation evidence.
Do not publish or push to GitHub yet.

A preview server is already running on port 4173 in another terminal.
Do not start a duplicate server. Rebuild the project so I can refresh the existing preview.

When finished, summarize what changed and tell me how to test slides 7 and 8.
```
