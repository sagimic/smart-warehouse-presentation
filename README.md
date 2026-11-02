# Smart Warehouse — interactive educational presentation

A Hebrew RTL presentation containing exactly ten slides, built with HTML, CSS, JavaScript, Vite, and Three.js. It retains the light background, dark typography, blue/turquoise accents, previous/next buttons, keyboard navigation, slide counter, and fullscreen handling.

## Setup and preview (Windows PowerShell)

Original user project-building prompts are preserved in the [prompts folder and index](prompts/README.md). These are original prompts organized by stage, not a replacement for a complete original-session conversation transcript.

Developed with Node.js 24.22.1 and npm 11.19.1. Use `npm.cmd`; no PowerShell execution-policy change is required.

```powershell
cd C:\Users\sagim\smart-warehouse-presentation
npm.cmd ci
npm.cmd test
npm.cmd run build
```

Your existing preview server on port 4173 serves `dist/`. After building, refresh http://127.0.0.1:4173/. No duplicate server was started. If the preview server is stopped in a future session, run:

```powershell
npm.cmd run preview -- --port 4173 --strictPort
```

For development instead, run `npm.cmd run dev -- --port 5173 --strictPort` and open http://127.0.0.1:5173/. Stop a server using Ctrl+C.

## Presentation specifications

Exactly 10 slides follow [prd.md](prd.md): introduction; traditional warehouse challenges; automation, pathfinding, and AI; one sample order; route comparison; demand and placement; audience order selection; blocked aisles; benefits, limitations, and people; development with Codex.

- Slide 1: static 3D overview with shelves, colored products, aisles, packing station, and robot.
- Slide 4: guided Order 1 simulation with the same start/pause/resume/reset controls.
- Slide 5: computed fixed-versus-optimized Order 1 distances and buttons to show each route under identical conditions.
- Slide 7: three predefined single-choice orders, immediate target markers, product collection status, route visualization, computed length, and robot controls.
- Slide 8: the same interactive state plus a toggle for one marked aisle and a separate fixed unreachable-notebook scenario.
- Right Arrow advances; Left Arrow goes back; Home/End select the first/last slide. Keys inside form controls retain their native behavior. Navigation does not wrap.
- Dot buttons and fragments such as `#slide-7` permit direct navigation. The fullscreen button toggles fullscreen; rejection produces a Hebrew explanation.
- Reduced-motion preferences disable automatic slide-entry animation. Robot movement starts only after an explicit Start/Resume action.

## Warehouse and routing assumptions

The warehouse is an 11 by 9 grid. Shelf cells at columns 3 and 7, rows 1 through 6, are occupied. Product pickup positions are accessible cells beside shelves. The packing station is cell (1, 7). Grid coordinates here are developer documentation; presentation text remains Hebrew.

Products: notebook (blue), headphones (purple), bottle (turquoise). Thick gold rings mark targets; Hebrew labels identify products and collection checks distinguish collected items without relying on color alone. A thick blue floor ribbon and dots show the full picking route. The orange robot contrasts with the blue route and pale floor without changing its footprint or movement rules.

Camera framing measures the projected model geometry and billboard labels, including hidden collection labels and the robot's full travel envelope, rather than a large enclosing world-space box. A small safety margin keeps them inside the viewport on resize/fullscreen. Taller scene canvases and larger, high-contrast status text and controls improve projection readability. Framing math is tested; actual visual appearance after these changes still needs browser review.

The route algorithm uses breadth-first search with four orthogonal neighbors and equal edge costs. For each of the small order's possible pickup sequences, it joins shortest legs and chooses the shortest full round trip. It does not claim optimality for real warehouse operations. Distance counts traversed edges, including the return to packing. One clearly labeled demonstration unit equals one move between adjacent grid cells, not a physical meter. An unplanned or invalid route has unavailable length.

The renderer and movement validator share occupancy data. Each movement segment must join adjacent, traversable cells. The robot interpolates along those segments rather than cutting across shelves or corners. Geometry is smaller than aisle clearance; automated tests sample entire journeys for obstacle intersections using a conservative footprint bound.

The marked aisle consists of cells (1, 4) and (2, 4). Blocking it automatically replans from the station and waits for Start. Order 2 gives a different, longer route around the blockage. The separate failure preset isolates the notebook pickup by closing its remaining accessible neighbors. Orders requiring the notebook then show the exact Hebrew no-route message; the route clears and movement cannot begin. This preset is distinct from the single-aisle toggle.

## Simulation controls and state

- Start validates selection, plans if needed, and begins. It is disabled during running/paused states. After completion, Start replays from the station.
- Pause freezes position, progress, and collection state. Resume continues from the exact paused position. Each is enabled only in the appropriate state.
- Reset stops movement, restores open aisles, clears metrics/messages/progress, and returns the robot immediately to the station. Slides 7/8 clear selection and highlights; guided slide 4 restores Order 1.
- Changing an order or obstacles stops and resets motion before planning. A new route waits for Start.
- Slides 7/8 share selection, obstacles, route, position, and pickups. Moving between them pauses an active journey, preserves that state, and requires Resume. Slide 4 has independent guided state; slide 1 stays static.
- Leaving an interactive slide or hiding the browser tab pauses movement. One renderer is reused; rendering stops when idle or off a warehouse slide. ResizeObserver updates renderer size and camera framing for resizing/fullscreen.
- When WebGL initialization fails or its context is lost, a Hebrew explanation and static map replace the scene; navigation remains usable and Start/Resume are disabled. Refresh after restoring graphics support.

## Educational accuracy

The running simulation uses automation and a deterministic pathfinding algorithm, not a trained AI model. The presentation explicitly separates those concepts. All orders and examples are demonstration material, not real warehouse measurements or productivity statistics. The forecasting slide remains a conceptual explanation: there is no trained forecast model, dataset, or asserted efficiency percentage.

## Workflow and files

The PRD was written first, then a ten-slide presentation shell was built and reviewed by the user. This stage adds the warehouse, a separately testable routing/state engine, and its UI integration while retaining the existing presentation design.

- `index.html`: Hebrew RTL document and persistent navigation.
- `src/main.js`: ten-slide content and navigation/fullscreen integration.
- `src/style.css`: responsive layout, visual design, and simulation panels.
- `src/simulation.js`: warehouse data, BFS routing, pickup sequencing, and simulation state machine.
- `src/warehouse.js`: Three.js scene, Hebrew labels, route/barrier display, controls, resizing, and slide lifecycle.
- `src/framing.js`: projected scene bounds and aspect-preserving camera fitting.
- `tests/simulation.test.js`: route, footprint, collection, control-state, failure, and recovery checks.
- `tests/framing.test.js`: camera containment and tight-fit checks across multiple aspect ratios.
- `package.json` / `package-lock.json`: dependencies and dev/build/preview/test scripts.
- `.gitignore`: excludes generated builds, dependencies, logs, and local environment files.
- `prd.md`: full assignment plan and evidence-qualified completion checklist.

No backend, paid API, external font request, or Python is needed. No GitHub publication or push was performed. Screenshots and actual original-session conversation evidence remain outstanding; none has been fabricated. Slide 10's personal reflection still requires the student's review. The demand/placement chart and selectable explanatory cards in the full PRD are not yet implemented.

## Verification and manual review

`npm.cmd test` passes 15 automated tests. They cover all three orders with the aisle open/blocked, adjacency and occupancy, sampled robot-footprint clearance, full return-trip length, reachable pickups, a known shortest-path distance, fair comparison/tie handling, a changed Order 2 detour, pause/resume (including after collection), replay, all reset states, selection changes, obstacle changes, no-route recovery, and rejection of an invalid movement segment. The added camera test checks model/label bounds, robot-travel clearance, full containment, and tight aspect-preserving framing at five viewport aspect ratios.

The production build and JavaScript syntax checks pass. Source inspection confirms ten slide definitions. The existing preview endpoint responds with HTTP 200. These checks do not establish visual correctness or browser event behavior.

The user confirmed in their browser that the robot moves, collected-product indicators update, and blocking the aisle changes the route length from 28 to 32 demonstration units on slides 7/8. This feedback does not verify pause/resume, reset, no-route handling, resizing, fullscreen, or the revised visuals. No other manual check is marked passed.

Agent browser visual/interactive testing remains unavailable in this environment; the previous computer-use attempt was stopped because it could not reliably determine Chrome's URL. No browser screenshots or console results are claimed. Review this short checklist in your browser:

1. Refresh http://127.0.0.1:4173/ and inspect the static overview. Check laptop fit, Hebrew labels, keyboard navigation, and the ten-slide counter.
2. Open `#slide-7`. Start without a selection to check validation. Select each order and confirm gold target markers and matching product labels. Start, pause mid-edge, resume, and wait for collection and return to packing.
3. Select Order 2, start and pause, then navigate to slide 8. Confirm preserved state and paused motion. Toggle the marked aisle: the robot returns to packing, the route and length change, and movement waits for Start.
4. On slide 8 select Order 1 and enable the fixed no-access-to-notebook scenario. Confirm the clear Hebrew no-route message, no stale route/length, and no movement. Turn it off and Start to verify recovery.
5. Reset from running, paused, completed, and failure states. Confirm station position, open aisles, cleared order/highlights, and appropriate button states. Leave an active slide and return: it must remain paused until Resume.
6. Resize the window and enter/exit fullscreen on slides 7/8. Confirm the whole warehouse stays framed and controls/text do not overlap; check the narrower stacked layout as well. Inspect the browser console for errors.
