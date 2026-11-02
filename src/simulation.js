// Shared grid data drives both rendering and path validation. Cells are one demo unit apart.
export const WIDTH = 11, HEIGHT = 9;
export const STATION = [1, 7];
export const key = ([x, z]) => `${x},${z}`;
export const SHELVES = [];
for (const x of [3, 7]) for (let z = 1; z <= 6; z++) SHELVES.push([x, z]);
export const PRODUCTS = [
  { id: 'notebook', label: 'מחברת', shelf: [3, 2], pickup: [2, 2], color: 0x3386df },
  { id: 'headphones', label: 'אוזניות', shelf: [7, 2], pickup: [8, 2], color: 0x9964d8 },
  { id: 'bottle', label: 'בקבוק', shelf: [3, 5], pickup: [2, 5], color: 0x10a99d }
];
export const ORDERS = [[0, 1, 2], [0, 2], [1, 2]];
export const AISLE = [[1, 4], [2, 4]];
// Fixed failure preset closes the four accessible neighbors of the notebook pickup.
export const FAILURE = [[1, 2], [2, 1], [2, 3]];
export const NO_ROUTE = 'לא נמצא מסלול תקין להזמנה זו. יש לפתוח מעבר או לבחור הזמנה אחרת.';
export function occupancy(blocked = false, failure = false) {
  return new Set([...SHELVES, ...(blocked ? AISLE : []), ...(failure ? FAILURE : [])].map(key));
}
export function traversable(cell, occupied) {
  return cell[0] >= 0 && cell[0] < WIDTH && cell[1] >= 0 && cell[1] < HEIGHT && !occupied.has(key(cell));
}
export function shortestPath(from, to, occupied) {
  if (!traversable(from, occupied) || !traversable(to, occupied)) return null;
  const queue = [from], parents = new Map([[key(from), null]]);
  for (let i = 0; i < queue.length; i++) {
    const cell = queue[i];
    if (key(cell) === key(to)) {
      const result = [];
      for (let cursor = cell; cursor; cursor = parents.get(key(cursor))) result.push(cursor);
      return result.reverse();
    }
    for (const [dx, dz] of [[1, 0], [0, -1], [-1, 0], [0, 1]]) {
      const next = [cell[0] + dx, cell[1] + dz];
      if (traversable(next, occupied) && !parents.has(key(next))) {
        parents.set(key(next), cell); queue.push(next);
      }
    }
  }
  return null;
}
function permutations(list) {
  return list.length ? list.flatMap((item, i) => permutations(list.filter((_, j) => j !== i)).map(rest => [item, ...rest])) : [[]];
}
export function plan(order, blocked = false, failure = false, optimized = true) {
  if (!Number.isInteger(order) || !ORDERS[order]) return null;
  const occupied = occupancy(blocked, failure);
  let best = null;
  for (const sequence of optimized ? permutations(ORDERS[order]) : [ORDERS[order]]) {
    const cells = [STATION], events = [];
    let valid = true;
    for (const product of [...sequence, null]) {
      const destination = product === null ? STATION : PRODUCTS[product].pickup;
      const leg = shortestPath(cells.at(-1), destination, occupied);
      if (!leg) { valid = false; break; }
      cells.push(...leg.slice(1));
      if (product !== null) events.push({ index: cells.length - 1, product });
    }
    if (valid && (!best || cells.length < best.cells.length)) best = { cells, events, length: cells.length - 1, sequence };
  }
  return best;
}
export class Simulation {
  constructor(order = null) { this.defaultOrder = order; this.reset(); }
  reset() {
    this.order = this.defaultOrder; this.blocked = false; this.failure = false;
    this.prepare();
  }
  prepare() {
    this.route = plan(this.order, this.blocked, this.failure);
    this.progress = 0; this.collected = new Set(); this.position = [...STATION];
    this.status = this.order === null ? 'idle' : this.route ? 'ready' : 'no-route';
    this.message = this.status === 'no-route' ? NO_ROUTE : '';
  }
  select(order) { this.order = Number.isInteger(order) && ORDERS[order] ? order : null; this.prepare(); }
  obstacles(blocked, failure = false) { this.blocked = blocked; this.failure = failure; this.prepare(); }
  start() {
    if (this.status === 'running' || this.status === 'paused') return;
    if (this.order === null) { this.message = 'יש לבחור הזמנה לפני ההתחלה.'; return; }
    this.prepare();
    if (this.route) this.status = 'running';
  }
  pause() { if (this.status === 'running') this.status = 'paused'; }
  resume() { if (this.status === 'paused' && this.route) this.status = 'running'; }
  leave() { this.pause(); }
  tick(seconds) {
    if (this.status !== 'running' || !Number.isFinite(seconds) || seconds <= 0) return;
    const occupied = occupancy(this.blocked, this.failure);
    const nextProgress = Math.min(this.route.length, this.progress + seconds * 2.5);
    // Check every traversed segment, even for large time steps in tests.
    for (let i = Math.floor(this.progress); i < Math.ceil(nextProgress); i++) {
      const a = this.route.cells[i], b = this.route.cells[i + 1];
      if (!a || !b || !traversable(a, occupied) || !traversable(b, occupied) || Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) !== 1) {
        this.route = null; this.status = 'no-route'; this.message = NO_ROUTE; return;
      }
    }
    this.progress = nextProgress;
    const i = Math.floor(this.progress), fraction = this.progress - i;
    const a = this.route.cells[i], b = this.route.cells[Math.min(i + 1, this.route.length)];
    this.position = [a[0] + (b[0] - a[0]) * fraction, a[1] + (b[1] - a[1]) * fraction];
    for (const event of this.route.events) if (event.index <= this.progress) this.collected.add(event.product);
    if (this.progress === this.route.length) this.status = 'completed';
  }
}
