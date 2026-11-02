import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Simulation, plan, occupancy, traversable, STATION, PRODUCTS, ORDERS, SHELVES, AISLE, NO_ROUTE, shortestPath } from '../src/simulation.js';

for (let order=0; order<3; order++) for (const blocked of [false,true]) {
  test(`order ${order+1}, aisle ${blocked?'blocked':'open'}: complete valid shortest-pick-order route`, () => {
    const route=plan(order,blocked), occupied=occupancy(blocked);
    assert.ok(route); assert.equal(route.length,route.cells.length-1);
    assert.deepEqual(route.cells[0],STATION); assert.deepEqual(route.cells.at(-1),STATION);
    assert.deepEqual([...route.events.map(e=>e.product)].sort(),[...ORDERS[order]].sort());
    route.events.forEach(e=>assert.deepEqual(route.cells[e.index],PRODUCTS[e.product].pickup));
    route.cells.forEach((cell,i)=>{
      assert.ok(traversable(cell,occupied));
      if(i) assert.equal(Math.abs(cell[0]-route.cells[i-1][0])+Math.abs(cell[1]-route.cells[i-1][1]),1);
      // Robot radius .3 stays clear of .9-wide shelf/barrier footprints, even on turns.
      for(const obstacle of [...SHELVES,...(blocked?AISLE:[])]) assert.ok(Math.hypot(cell[0]-obstacle[0],cell[1]-obstacle[1])>=1);
    });
    assert.ok(route.length<=plan(order,blocked,false,false).length);
    const sim=new Simulation(); sim.select(order); sim.obstacles(blocked); sim.start();
    for(let i=0;i<20000&&sim.status==='running';i++){
      sim.tick(.017);
      for(const [x,z] of [...SHELVES,...(blocked?AISLE:[])]) {
        const [rx,rz]=sim.position;
        assert.ok(Math.abs(rx-x)>.75 || Math.abs(rz-z)>.75, 'visible footprint must not intersect obstacle');
      }
    }
    assert.equal(sim.status,'completed'); assert.deepEqual(sim.position,STATION); assert.equal(sim.collected.size,ORDERS[order].length);
  });
}
test('known shortest distance and blocked endpoints',()=>{
  assert.equal(shortestPath([0,0],[10,0],occupancy()).length-1,10);
  assert.equal(shortestPath([3,2],STATION,occupancy()),null);
});
test('predefined aisle visibly changes Order 2 route and length',()=>{
  assert.notDeepEqual(plan(1).cells,plan(1,true).cells);
  assert.ok(plan(1,true).length>plan(1).length);
});
test('pause/resume preserves exact progress and collection; leaving pauses',()=>{
  const sim=new Simulation(0); sim.start(); sim.tick(.173); sim.pause();
  const snapshot={position:[...sim.position],progress:sim.progress,collected:[...sim.collected]};
  sim.tick(20); sim.start(); assert.equal(sim.status,'paused');
  assert.deepEqual({position:sim.position,progress:sim.progress,collected:[...sim.collected]},snapshot);
  sim.resume(); sim.tick(.1); assert.ok(sim.progress>snapshot.progress);
  sim.leave(); assert.equal(sim.status,'paused'); sim.tick(10); assert.equal(sim.status,'paused');
});
test('selection validation, order switching, failure, recovery, and every reset state',()=>{
  const sim=new Simulation(); sim.start(); assert.equal(sim.status,'idle'); assert.ok(sim.message);
  for(const state of ['running','paused','completed','no-route']){
    sim.select(0); sim.start();
    if(state==='paused')sim.pause();
    if(state==='completed')sim.tick(1000);
    if(state==='no-route')sim.obstacles(true,true);
    assert.equal(sim.status,state); sim.reset();
    assert.equal(sim.order,null);assert.equal(sim.status,'idle');assert.equal(sim.route,null);
    assert.deepEqual(sim.position,STATION);assert.equal(sim.blocked,false);assert.equal(sim.failure,false);assert.equal(sim.collected.size,0);assert.equal(sim.message,'');
  }
  sim.select(0);sim.start();sim.tick(1);sim.select(2);
  assert.equal(sim.status,'ready'); assert.equal(sim.progress,0);assert.equal(sim.collected.size,0);
  sim.obstacles(false,true);assert.equal(sim.status,'ready'); // order without notebook remains reachable
  sim.select(0); assert.equal(sim.status,'no-route'); assert.equal(sim.message,NO_ROUTE);assert.equal(sim.route,null);
  sim.resume();sim.start();sim.tick(1);assert.equal(sim.status,'no-route');
  sim.obstacles(false,false); assert.equal(sim.status,'ready'); sim.start();sim.tick(1000);assert.equal(sim.status,'completed');
  sim.start();assert.equal(sim.status,'running');assert.equal(sim.progress,0);
  const guided=new Simulation(0);guided.start();guided.tick(1);guided.reset();assert.equal(guided.order,0);assert.equal(guided.status,'ready');
});
test('obstacle edits while running or paused discard old motion before replanning',()=>{
  for(const pause of [true,false]){
    const sim=new Simulation(1);sim.start();sim.tick(1);if(pause)sim.pause();
    sim.obstacles(true);assert.equal(sim.status,'ready');assert.equal(sim.progress,0);assert.deepEqual(sim.position,STATION);
    const p=[...sim.position];sim.tick(10);assert.deepEqual(sim.position,p);
  }
});
test('movement rejects an invalid next segment without entering obstacle',()=>{
  const sim=new Simulation(0);sim.start(); sim.route.cells[1]=[3,2];sim.tick(1);
  assert.equal(sim.status,'no-route');assert.equal(sim.route,null);assert.deepEqual(sim.position,STATION);
});
test('pause after pickup retains collected products and replay clears them',()=>{
  const sim=new Simulation(0);sim.start();sim.tick((sim.route.events[0].index+.2)/2.5);
  assert.equal(sim.collected.size,1);sim.pause();const progress=sim.progress;
  sim.tick(100);assert.equal(sim.progress,progress);assert.equal(sim.collected.size,1);
  sim.resume();sim.tick(1000);assert.equal(sim.status,'completed');assert.equal(sim.collected.size,3);
  sim.start();assert.equal(sim.collected.size,0);assert.equal(sim.progress,0);
});
test('comparison supports a tie and same complete round-trip endpoints',()=>{
  const fixed=plan(1,false,false,false), optimized=plan(1);
  assert.equal(fixed.length,optimized.length);
  assert.deepEqual(fixed.cells[0],optimized.cells[0]);assert.deepEqual(fixed.cells.at(-1),optimized.cells.at(-1));
});
