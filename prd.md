# Product Requirements Document

## Project and current scope

**Project:** The Smart Warehouse: The Journey of an Order in the Age of AI

**Proposed Hebrew presentation title:** המחסן החכם: מסע ההזמנה בעידן הבינה המלאכותית

**Audience:** A third-year Management and Technology student’s Generative AI course class.

**Goal:** Explain an order’s journey through a smart warehouse using a concise Hebrew presentation, a meaningful interactive 3D simulation, and an honest account of how Codex supported development.

The initial step created only `prd.md`; the user subsequently authorized the slide presentation and then the Three.js simulation. The current local version implements those stages. GitHub publication, screenshots, and conversation evidence remain outstanding. Checked items below have the specific evidence stated in the verification record; browser-dependent criteria remain unchecked until actual browser verification.

## Required assignment deliverables

- A browser-based interactive presentation containing exactly 10 slides in Hebrew with right-to-left layout.
- JavaScript-powered animation and a meaningful 3D warehouse element.
- A GitHub repository containing the project source code.
- `README.md` describing the repository, presentation specifications, development workflow, and setup instructions.
- Several actual presentation screenshots embedded in `README.md`; plan at least four captures showing different slides and interaction states.
- `prd.md` containing the planned requirements and verification checklist.
- A separate file, proposed as `codex-conversations.md`, containing actual conversations with Codex saved from the original session. Never reconstruct or invent dialogue.

## Planned implementation and boundaries

- Use HTML, CSS, JavaScript, Vite, and Three.js. No backend or paid API is required. Do not introduce Python unless a specific need is identified.
- Set the document language to Hebrew and its direction to RTL. Isolate code, identifiers, and numerals as needed so mixed-direction content remains readable.
- Use concise text, readable Hebrew typography, strong contrast, and a consistent layout. Target a 16:9 classroom display while keeping controls usable on smaller screens.
- Provide persistent previous and next buttons, a slide counter such as `3 / 10`, and a fullscreen toggle with a clear fallback when fullscreen is unavailable.
- Keyboard behavior: Right Arrow advances and Left Arrow goes back, explicitly documented in Hebrew; Home and End reach the first and last slides. Do not intercept keys used inside form controls. At the first and last slides, disable the unavailable navigation action; do not wrap.
- Provide visible focus states, meaningful Hebrew button labels, and keyboard access to every interaction. Respect reduced-motion preferences and provide a pause/resume control for the robot animation.
- Build a small 3D warehouse containing shelves, identifiable products, aisles, a start/packing station, and an animated robot. The robot must follow the computed traversable route; the 3D scene must communicate picking and obstacle handling rather than serve only as decoration.
- Keep slide changes and repeated interactions reliable: clear old route state, avoid duplicate animation loops, and pause rendering when the scene is hidden where practical.

## Required simulation controls

Provide four clearly labeled, keyboard-accessible controls wherever the robot journey is demonstrated. Display a Hebrew status indicating ready, running, paused, completed, or no valid route.

| Control | Hebrew label | Required behavior |
| --- | --- | --- |
| Start | התחלה | Validate the selected order, compute a valid route if needed, and begin from the packing station. If no order is selected, show a Hebrew validation message. If no valid route exists, show the specified no-route message and keep the robot stopped. Disable while running or paused; use Resume for a paused journey. |
| Pause | השהיה | Freeze the robot immediately, preserving its position, route progress, and collected-product state. Enable only while running. |
| Resume | המשך | Continue from the exact paused position and pickup state without restarting or duplicating pickups. Enable only while paused with a valid route. |
| Reset | איפוס | Stop motion, return the robot to the packing station, clear route, progress, metrics, messages, and product highlights, and restore unblocked aisles. On slide 7, clear the order selection; on the guided slide 4, restore its predefined Order 1 and initial product highlights. Leave the current slide unchanged. |

Keep all four controls visible with unavailable actions disabled. After completion, disable Pause and Resume; Start may replay the current order from its initial state. A separate route-preview action labeled **תכננו מסלול** may be retained, but Start must also work without that extra step. Changing orders stops the current journey and returns the robot to the station before updating highlights. Changing obstacles stops motion and resets journey progress before replanning from the station; require Start to move again. Leaving a robot demonstration slide pauses an active journey; returning must require an explicit Resume rather than silently restarting motion.

## Demonstration logic and conceptual accuracy

Use a fixed, small warehouse grid with traversable aisle cells, occupied shelf cells, and product pickup points next to shelves. All products, orders, demand values, timings, and metrics are demonstration data. Show a persistent or clearly adjacent label: **נתוני הדגמה בלבד — אינם נתונים ממחסן אמיתי**. The demand chart must repeat this qualification.

Offer exactly three predefined orders through a single-choice selector with no default selection. Show each order’s products before starting. The audience chooses an order rather than individual products:

| Hebrew order label | Hebrew product list |
| --- | --- |
| הזמנה 1 | מחברת, אוזניות ובקבוק |
| הזמנה 2 | מחברת ובקבוק |
| הזמנה 3 | אוזניות ובקבוק |

Use Order 1 for the guided journey on slide 4. All three orders must work on the unblocked map; blocked-aisle scenarios may make a selected order unreachable.

Immediately highlight all products belonging to the selected order in the 3D warehouse, before route planning or robot movement. Use a visible outline or marker plus readable Hebrew labels so identification does not depend on color alone. Match these highlights to the selected order’s product list. Keep pending and collected products distinguishable during animation. Switching orders must remove previous highlights and apply the new selection; reset must clear them. Keep selected-product highlights visible in blocked-aisle and no-route states.

The robot starts at the packing station, visits pickup points for the selected order, and returns to the station. Compute routes on the grid using a deterministic pathfinding algorithm such as breadth-first search for equal-cost moves. Compare a fixed picking sequence with a sequence selected by evaluating the possible pickup orders for the small sample set. Apply identical start/end points, product sets, obstacle states, and distance units to both routes. Describe any shortest-route claim as limited to this small grid and its stated assumptions.

Animate the robot visibly and continuously along the valid computed picking route using JavaScript. Interpolate movement between adjacent traversable grid cells; do not teleport between products or cut across shelves, blocked aisles, or corners. Highlight the route so the audience can follow the journey. Mark a product as collected only when the robot reaches its designated pickup point. Complete the animation at the packing station after all selected products have been collected. Movement must respect Start, Pause, Resume, and Reset and must never begin when route validation fails.

**Mandatory movement constraint:** The robot must never pass through shelves or blocked aisles, including during interpolated movement, turns, replanning, and Resume. Use the same occupancy map for pathfinding and movement validation. Keep the robot’s visible footprint within traversable aisle space, with sufficient clearance from shelf and barrier geometry. Validate each next movement segment before entering it; if it becomes obstructed, stop before the obstacle, invalidate the stale route, and recalculate or display the no-valid-route message. Do not animate a direct shortcut through obstacles when returning to the station after an input change or Reset; restore the initial position immediately with motion stopped.

Count distance in grid steps and display route length in clearly labeled demonstration units: **אורך המסלול: {N} יחידות הדגמה**. Place the explanation **יחידת הדגמה אחת = מעבר בין שני תאי רשת סמוכים; אינה מטר במציאות** next to the metric. Count the full route from the packing station through all required pickup points and back; calculate length from traversed grid edges, not animation frames. Use this labeling consistently in route comparisons and interactive order and blockage demonstrations. Display actual computed results and their difference, with the difference also labeled **יחידות הדגמה**; do not hard-code improvement percentages or guarantee that every order produces a shorter route. A tie must be displayed honestly. When no valid route exists or no route has been planned, show **אורך המסלול: לא זמין**, never a misleading zero or an outdated length. Robot animation duration is a visual aid, not a measured warehouse productivity result.

Recompute after a blockage changes. Never draw a route through shelves or blocked cells. If any required pickup or the return station is unreachable, clear stale paths, stop the robot, and show **לא נמצא מסלול תקין להזמנה זו. יש לפתוח מעבר או לבחור הזמנה אחרת.** Provide reset and recovery actions. Validate order selections and require at least one product before starting.

Allow the audience to block exactly one predefined aisle using a clearly labeled toggle: **חסימת המעבר המסומן**. Identify that aisle visibly before the toggle is activated; its location is fixed, and arbitrary aisle editing is outside required scope. Blocking it must mark its affected grid cells as non-traversable, show a visible barrier in 3D, and automatically calculate an alternative route for the selected order. Update the highlighted route and its length in demonstration units, then wait for Start before moving. Configure the map so at least one predefined order has a valid, different route around this blockage. Toggling the same aisle open restores traversability and recalculates the route. With no order selected, update only the map and request an order selection. Preserve the separate reproducible no-route scenario required below without adding another audience-selectable blocked aisle; it may use a clearly labeled fixed scenario preset for an unreachable pickup. Keep that preset separate from the normal single-aisle toggle.

Explicitly distinguish these concepts in the presentation:

- **אוטומציה:** ביצוע פעולות לפי כללים שהוגדרו מראש.
- **אלגוריתם למציאת מסלול:** חישוב דרך במפה לפי כללים ואילוצים; אינו בהכרח בינה מלאכותית.
- **בינה מלאכותית:** יכולה ללמוד מנתונים כדי לתמוך בחיזוי ובהחלטות; הדגמה זו אינה מפעילה מודל מאומן.

Codex supports the creation of the project. This does not mean the running warehouse demonstration contains a trained AI model. The forecasting slide illustrates a potential use of AI through synthetic demand examples; it must not imply that an actual forecast model was trained or executed.

## Slide specifications

### 1. Introduction: What happens after we place an order?

**Purpose:** Introduce the order journey and the question guiding the presentation.

**Proposed Hebrew title:** המחסן החכם: מה קורה אחרי שמזמינים?

**Proposed Hebrew content:**
- הזמנה אחת מתחילה מסע: קליטה, ליקוט, אריזה ומשלוח.
- איך טכנולוגיה יכולה לשפר את הדרך?
- נעקוב אחר הזמנה במחסן הדגמה תלת־ממדי.

**Visual / interaction:** A compact 3D warehouse overview with the journey stages highlighted in sequence.

**Acceptance criteria:** The title and journey are readable in RTL; the scene visibly includes shelves, products, aisles, and a robot; the demonstration-data label is visible.

### 2. Challenges in a traditional warehouse

**Purpose:** Establish the operational problems before introducing solutions.

**Proposed Hebrew title:** האתגרים במחסן המסורתי

**Proposed Hebrew content:**
- הליכה ממושכת בין מדפים.
- טעויות ליקוט וקושי באיתור מוצרים.
- עומס, מעברים חסומים ושינויים בביקוש.

**Visual / interaction:** A simple warehouse map with selectable problem markers and a visibly indirect illustrative route.

**Acceptance criteria:** Each marker reveals its related challenge using click or keyboard; no unsupported statistics or universal claims appear.

### 3. What makes a warehouse smart?

**Purpose:** Separate automation, pathfinding, and AI accurately.

**Proposed Hebrew title:** מה הופך מחסן לחכם?

**Proposed Hebrew content:**
- אוטומציה מבצעת פעולות לפי כללים.
- אלגוריתם למציאת מסלול מחשב דרך בין נקודות.
- בינה מלאכותית יכולה ללמוד מנתונים ולסייע בחיזוי.
- בהדגמה שלנו אין מודל בינה מלאכותית מאומן.

**Visual / interaction:** Three selectable concept cards linked to examples: a picking instruction, a computed route, and a conceptual demand forecast.

**Acceptance criteria:** All three concepts and their differences are explicit; selecting a card reveals a concise example; neither routing nor the simulation is described as a trained AI model.

### 4. Follow one sample order through the warehouse

**Purpose:** Connect warehouse operations to one concrete order.

**Proposed Hebrew title:** מסע של הזמנה אחת

**Proposed Hebrew content:**
- הזמנת הדגמה: מחברת, אוזניות ובקבוק.
- מאתרים את המוצרים ומתכננים מסלול.
- הרובוט אוסף את הפריטים וחוזר לעמדת האריזה.

**Visual / interaction:** Start, Pause, Resume, and Reset controls animate and manage the robot journey through the 3D warehouse; the order list marks each product when its pickup point is reached.

**Acceptance criteria:** Product labels match the order and shelf locations; the robot visibly follows adjacent traversable cells along the highlighted computed route without teleporting or crossing obstacles; pickup status changes only at the corresponding pickup points; the robot returns to the packing station after collecting all selected products; all four controls follow the required simulation-control behavior; Pause freezes progress, Resume continues without duplicate pickups, and Reset restores the guided order’s initial state.

### 5. Compare two picking routes

**Purpose:** Make the effect of route planning measurable under stated assumptions.

**Proposed Hebrew title:** אותה הזמנה, שני מסלולי ליקוט

**Proposed Hebrew content:**
- נשווה סדר איסוף קבוע לסדר איסוף מחושב.
- אותם מוצרים, אותה נקודת התחלה ואותם מכשולים.
- נמדוד את אורך המסלול ביחידות הדגמה: כל יחידה היא צעד ברשת.
- התוצאה מתייחסת למפת ההדגמה בלבד.

**Visual / interaction:** Toggle or overlay two distinctly labeled routes with computed step counts and an absolute distance difference. Use labels or line styles in addition to color.

**Acceptance criteria:** Both routes collect the same products and return to the same station; lengths count traversed grid edges for the complete journey; both lengths and their difference are labeled in Hebrew as demonstration units with the unit explanation visible; ties are supported; no physical distances or time savings are claimed from animation speed.

### 6. Demand forecasting and product placement

**Purpose:** Explain a potential AI application while keeping the actual demo honest.

**Proposed Hebrew title:** חיזוי ביקוש ומיקום מוצרים

**Proposed Hebrew content:**
- דפוסי ביקוש עשויים לסייע בתכנון המלאי.
- אפשר למקם מוצרים מבוקשים קרוב לעמדת האריזה.
- חיזוי אמיתי דורש נתונים, מודל ובדיקת איכות.
- כאן מוצגים נתונים סינתטיים להמחשה בלבד, ללא מודל מאומן.

**Visual / interaction:** A small synthetic demand chart and a before/after conceptual product-placement view with a toggle.

**Acceptance criteria:** Synthetic values are labeled next to the chart; the toggle changes the placement illustration; no real prediction, trained model, or guaranteed efficiency improvement is implied. This illustration does not silently change the routing demo’s map.

### 7. Interactive demonstration: Choose an order

**Purpose:** Let the audience choose among three predefined orders and explore how each order changes the route.

**Proposed Hebrew title:** עכשיו אתם בוחרים את ההזמנה

**Proposed Hebrew content:**
- בחרו אחת משלוש הזמנות ההדגמה.
- המוצרים בהזמנה שנבחרה יודגשו במחסן.
- לחצו על ״תכננו מסלול״ והפעילו את הרובוט.
- השתמשו ב״התחלה״, ״השהיה״, ״המשך״ ו״איפוס״ לשליטה במסע.
- בדקו כיצד הבחירה משנה את מסלול הליקוט.

**Visual / interaction:** Three labeled single-choice order cards showing their product lists, immediate highlights and Hebrew labels on the selected products in the 3D warehouse, Start, Pause, Resume, and Reset controls, an optional route-preview action, a computed distance indicator, and the live 3D robot route.

**Acceptance criteria:** Exactly three predefined orders are available, matching the order table above; each can be selected and completed on the unblocked map; only one order can be selected at a time; selecting an order immediately highlights all and only its products in the warehouse using markers or outlines and Hebrew labels; pending and collected states remain distinguishable; starting without a selection produces a Hebrew validation message; changing the selected order clears outdated route/progress and replaces product highlights; reset returns to no selection and clears highlights; all four simulation controls follow the behavior and enabled states specified above and are keyboard accessible.

### 8. Handling a blocked aisle

**Purpose:** Show replanning, unreachable destinations, and operational limits.

**Proposed Hebrew title:** מה קורה כשמעבר נחסם?

**Proposed Hebrew content:**
- מעבר חסום משנה את האפשרויות במפה.
- חסמו את המעבר המסומן ובדקו את המסלול החלופי.
- נחשב מסלול חלופי אם הוא קיים.
- אם אין דרך תקינה, נעצור ונציג הודעה ברורה.
- פתחו את המעבר או בחרו הזמנה אחרת כדי להמשיך.

**Visual / interaction:** A toggle for blocking and reopening one visibly marked predefined aisle, automatic alternative-route calculation, a highlighted updated route and demonstration-unit length, a separate labeled fixed no-valid-route scenario preset, and Reset. Highlight the blockage in 3D.

**Acceptance criteria:** The audience can block and reopen exactly one predefined, visibly marked aisle; at least one predefined order produces a different valid alternative route automatically after blocking; the alternative avoids every blocked cell, collects all selected products, and returns to the packing station; its length updates in demonstration units; movement waits for Start; reopening recalculates the route; a separate fixed preset reproduces an unreachable selected pickup without introducing another selectable aisle; the exact no-route message defined above appears; the robot stops and stale routes disappear; Reset restores the unblocked map.

### 9. Benefits, limitations, and the human role

**Purpose:** Offer a balanced management perspective.

**Proposed Hebrew title:** יתרונות, מגבלות ותפקיד האדם

**Proposed Hebrew content:**
- תכנון וכלים דיגיטליים יכולים לסייע ביעילות ובבקרה.
- איכות הנתונים, עלויות ותקלות מגבילות את הפתרון.
- אנשים מגדירים יעדים, מטפלים בחריגים ומפקחים על הבטיחות.
- הסימולציה מפושטת ואינה מערכת לניהול מחסן אמיתי.

**Visual / interaction:** Three revealable cards for benefits, limitations, and human responsibilities.

**Acceptance criteria:** Each category has a concrete example; limitations of the grid and synthetic data are acknowledged; efficiency is framed as potential, not a measured real-world outcome.

### 10. How the project was built with Codex and what I learned

**Purpose:** Explain the development workflow and reflect on learning using real evidence.

**Proposed Hebrew title:** איך בניתי עם Codex ומה למדתי

**Proposed Hebrew content:**
- תהליך העבודה: אפיון, בנייה, בדיקה ושיפור.
- הכלים המתוכננים: HTML, CSS, JavaScript, Vite ו־Three.js.
- Codex סייע בפיתוח; אני אחראי להבנה, לבדיקה ולהחלטות.
- תובנה לסיכום: חשוב להבחין בין אוטומציה, אלגוריתמים ובינה מלאכותית.

**Visual / interaction:** A development timeline and links to the actual GitHub repository, README, and separate conversation-evidence file once available.

**Acceptance criteria:** Before delivery, change planned tool wording to match the tools actually used; replace reflection with the student’s verified learning where needed; links resolve to real artifacts; no invented dialogue, screenshots, or test outcomes appear.

## Documentation and evidence plan

The README must explain the project purpose, all 10 slides, Hebrew/RTL behavior, navigation keys, controls, routing assumptions, synthetic data, and the distinction between the demo and trained AI. Include prerequisites, the supported Node.js version actually used, dependency installation, local development, production build, and preview instructions verified against the eventual Vite scripts. Describe the actual workflow from PRD through implementation, review, and verification.

Capture at least four real screenshots after implementation: the 3D overview, a route comparison, a selected order in progress, and the no-valid-route state. Store them in a repository folder such as `docs/screenshots/`, embed them with relative paths and descriptive alt text, and check that they render on GitHub. Screenshots must show the running presentation; placeholders or generated mockups do not qualify.

Save actual conversation evidence separately from the original session in `codex-conversations.md` or another clearly documented text format. Preserve actual role labels and message order. If excerpts or privacy redactions are necessary, mark them explicitly without inventing replacement dialogue. Link to that file from the README. This PRD is a plan, not conversation evidence.

If external factual claims or assets are later added, record their real sources and asset licenses. Do not invent citations or include unsupported numerical claims. Record verification results only after checks are actually performed.

## Required implementation and delivery checklist

### Slides

- [ ] Slide 1: Introduction and 3D warehouse overview meet their acceptance criteria.
- [ ] Slide 2: Traditional warehouse challenges meet their acceptance criteria.
- [ ] Slide 3: Automation, pathfinding, and AI are distinguished accurately.
- [ ] Slide 4: The sample order journey and replay work correctly.
- [ ] Slide 5: Two comparable routes display computed distances honestly.
- [ ] Slide 6: Synthetic demand and conceptual placement are clearly labeled.
- [ ] Slide 7: Order selection changes the computed route correctly.
- [ ] Slide 8: Detour, no-route, and recovery scenarios work correctly.
- [ ] Slide 9: Benefits, limitations, and the human role are balanced.
- [ ] Slide 10: Actual development workflow, learning, and artifact links are accurate.
- [x] Exactly 10 slides exist, with no extra title or closing slide.

### Functionality and presentation quality

- [x] Build with HTML, CSS, JavaScript, Vite, and Three.js without a backend or paid API.
- [ ] Use Hebrew content, RTL layout, readable typography, and concise slide copy.
- [ ] Implement previous/next buttons, keyboard navigation, slide counter, and fullscreen handling.
- [ ] Render shelves, products, aisles, a packing station, and an animated robot in 3D.
- [ ] Animate the robot continuously along a highlighted, valid computed picking route through traversable cells, collect products at their pickup points, and return to the packing station without crossing obstacles or teleporting.
- [ ] Prevent the robot’s visible footprint from passing through shelves or blocked aisles throughout movement and turns, using shared occupancy data and next-segment validation.
- [ ] Implement visible Start, Pause, Resume, and Reset controls with Hebrew labels, correct enabled states, and a simulation status indicator.
- [ ] Implement fair route comparison using computed grid-step distances.
- [ ] Show computed route length and comparison differences in clearly labeled demonstration units, explain the grid-step definition, and show unavailable length for unplanned or invalid routes.
- [ ] Offer exactly three predefined orders with visible product lists and single-choice selection.
- [ ] Immediately highlight the selected order’s products in 3D with labels and non-color cues; update on order switching, distinguish collected products, and clear on reset.
- [x] Validate missing order selection and reset stale routes when the selected order changes.
- [x] Implement reproducible blocked-aisle and unreachable-pickup scenarios.
- [ ] Allow blocking and reopening one predefined marked aisle, automatically recalculate a valid alternative route when available, and update its displayed length before restarting motion.
- [ ] Display the required no-valid-route message, stop motion, and allow recovery.
- [x] Label demonstration data and explicitly state that no trained AI model runs in the demo.
- [ ] Provide visible focus, accessible control labels, pause/resume, and reduced-motion behavior.
- [ ] Handle unavailable WebGL with a readable Hebrew explanation and a static warehouse view so presentation navigation remains usable.

### Documentation, screenshots, and conversation evidence

- [ ] Put complete project source and dependency lockfile in the GitHub repository.
- [x] Add README purpose, specifications, workflow, routing assumptions, and limitations.
- [ ] Add verified installation, development, build, and preview instructions to README.
- [ ] Capture at least four actual presentation screenshots, including the no-route state.
- [ ] Embed the real screenshots in README with working relative links and alt text.
- [ ] Save actual original-session conversations in a separate evidence file.
- [ ] Link the PRD and conversation evidence from README.
- [ ] Keep this PRD aligned with the final agreed implementation and mark completion only with evidence.

### Final verification

- [ ] Verify all slide-specific acceptance criteria and the exact 10-slide count.
- [ ] Check Hebrew rendering, RTL ordering, text clipping, and contrast on a classroom-sized display and a smaller viewport.
- [ ] Exercise button and keyboard navigation, boundary states, slide counter, and fullscreen behavior.
- [x] Verify route validity, distance counts, equal-distance cases, product pickup order, and return to station.
- [ ] Verify demonstration-unit labels, the adjacent unit explanation, full round-trip edge counts, and unavailable-length states without stale metrics.
- [ ] Exercise all three predefined orders, missing selection, order switching, replay, reset, detour, no-route, and recovery.
- [ ] Verify that the single predefined aisle toggle produces a different valid route for at least one order, excludes blocked cells, updates demonstration-unit length, and recalculates when reopened.
- [ ] Inspect complete robot journeys and turns for shelf or barrier intersections; verify that blocking the aisle during movement or pause prevents entry into blocked space and invalidates the old route.
- [ ] Verify that product highlights match each selected order, update immediately, distinguish pickup progress, persist in no-route states, and clear on reset.
- [ ] Check repeated slide visits for stale state or duplicate animation behavior.
- [x] Verify Start validation, immediate Pause, exact-position Resume, completion/replay behavior, and full Reset from running, paused, completed, and no-route states.
- [ ] Verify that order changes, obstacle changes, and slide navigation stop or pause motion according to the simulation-control rules.
- [ ] Check keyboard access, reduced motion, pause/resume, and unavailable WebGL behavior.
- [ ] Run the actual production build and preview; inspect browser console and fix relevant errors.
- [ ] Follow setup instructions from a clean checkout and record actual results.
- [ ] Verify GitHub source, README images, evidence links, and slide 10 links.
- [ ] Review every AI-related claim and demonstration-data label for accuracy.
- [ ] Record completed checks and remaining limitations honestly, without fabricated sources, screenshots, transcripts, or results.

## Optional enhancements — outside required scope

These are optional only after the required deliverables work. They must not add slides beyond the required 10 or introduce a paid service dependency.

- [ ] Add touch-swipe navigation with safeguards against accidental slide changes during interactions.
- [ ] Add an optional guided camera tour and reset-view control.
- [ ] Add local-only persistence for the last viewed slide or selected order.
- [ ] Publish a static hosted version and add its real URL to README.
- [ ] Add a clearly labeled alternative deterministic routing strategy for further comparison.

## Completion definition

The assignment is complete when all required checklist items and slide acceptance criteria are satisfied, the repository and required evidence are available, and recorded verification reflects actual checks. Optional enhancements are not prerequisites. Current authorization covers local implementation and verification only; do not publish or push to GitHub.

## Local simulation implementation and verification record

Implemented scenes: static opening overview (slide 1), independently controlled guided Order 1 (slide 4), actual fixed/optimized route comparison (slide 5), main interactive order selection (slide 7), and the shared-state blocked-aisle demonstration (slide 8). Existing navigation, Hebrew RTL layout, fullscreen handling, and the 10-slide outline are retained. The synthetic demand chart/placement toggle and selectable explanatory cards remain unfinished; existing conceptual content is preserved.

The implementation uses an 11-by-9 four-neighbor grid, breadth-first search for each leg, and enumeration of the small set of pickup sequences. Products are collected from adjacent accessible cells, and the full route returns to the packing station. Colored shelf products have Hebrew labels, gold target markers, and collected checks. The robot follows orthogonal interpolated segments validated against the same occupied cells used in planning. One predefined aisle toggle changes Order 2's route and length. A separate fixed scenario isolates the notebook pickup to demonstrate the specified no-valid-route message.

Slides 7 and 8 share state. Leaving either pauses active motion without losing position or pickups; returning requires Resume. Order/obstacle edits reset motion to the station, replan, and wait for Start. Reset restores the original unblocked state and clears selection, except for guided Order 1 on slide 4. The renderer is reused across scenes, adapts its camera framing on resize/fullscreen, and provides a static map and Hebrew explanation if WebGL is unavailable. These browser integration paths are implemented but are not marked verified solely from code inspection.

Evidence for checked items:

- Source inspection confirms exactly ten slide definitions and explicit Hebrew demonstration-data/no-trained-model labels. README content was reviewed against the implemented architecture.
- `npm.cmd test` runs Node's test runner against the actual route/state engine: 14 passing tests cover all three orders with/without the aisle blockage; adjacency/occupancy and sampled footprint clearance; known path distance; complete round-trip counts and pickups; fair comparison and a tie; changed Order 2 detour; pause/resume including after collection; leaving a running simulation; replay; reset in all states; missing selection; order changes; obstacle edits; failure/recovery; and rejection of an invalid next segment.
- The checked control-state verification item refers to the automated state-machine checks, not mouse/keyboard browser interaction. The blocked-scenario item refers to reproducible model states; the full slide and toggle acceptance criteria remain unchecked pending browser review.
- `npm.cmd run build` passes with Three.js included. The existing preview server at port 4173 responds with HTTP 200; no duplicate server was started. JavaScript syntax checks pass. The bundler reports a non-fatal chunk-size advisory for the Three.js bundle.
- Browser visual checks, actual fullscreen/resizing interaction, browser console inspection, and UI highlight/control integration are not verified. Browser automation remains unavailable after the earlier computer-use tool stopped because it could not reliably determine Chrome's URL. README includes a manual checklist for these checks.
- No screenshots, sources, conversation transcripts, browser outcomes, or GitHub publication are fabricated. Screenshot capture, original-session evidence, clean-checkout verification, and final assignment completion remain outstanding.

### Visual clarity refinement

User-reported browser evidence: the robot moves on slides 7/8, collected-product indicators update, and blocking the aisle changes the displayed length from 28 to 32 demonstration units. This confirms only those observed behaviors; no additional manual checklist item is marked complete from this feedback.

The refinement fits the camera to actual projected model geometry and sprite labels, reserves space for collection labels and the robot across its travel area, and uses a smaller safety margin. Scene canvases are taller. The robot is orange, the blue route uses thick floor ribbons rather than single-pixel lines, target rings and pickup markers are thicker, and status/control typography is larger and higher contrast. Routing, robot footprint, control-state behavior, Hebrew RTL content, and the ten-slide count are preserved.

Current automated verification: all 15 tests pass, including the 14 existing simulation tests and a framing test for scene/label containment and tight aspect-preserving fitting across five viewport aspect ratios. The production build passes. No additional preview server was started. These checks do not establish that classroom readability, resized/fullscreen browser rendering, or other pending manual checks pass; those remain open for browser review.
