import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { fitCamera, warehouseBounds } from '../src/framing.js';

test('tight camera bounds include geometry, hidden billboard labels, and robot travel envelope', () => {
  const scene = new THREE.Scene();
  const floor = new THREE.Mesh(new THREE.BoxGeometry(11.35,.12,9.35));
  floor.position.set(5,-.12,4);scene.add(floor);
  const label = new THREE.Sprite();label.position.set(1,.8,8.15);label.scale.set(2.05,.48,1);label.visible=false;scene.add(label);
  const camera = new THREE.OrthographicCamera(-8,8,7,-7,.1,100);
  camera.position.set(15,19,20);camera.lookAt(5,.2,4);
  const bounds = warehouseBounds(scene,camera,11,9);
  const center=label.getWorldPosition(new THREE.Vector3()).applyMatrix4(camera.matrixWorldInverse);
  for(const x of [-1,1])for(const y of [-1,1])assert.ok(bounds.containsPoint(new THREE.Vector2(center.x+x*1.025,center.y+y*.24)));
  // Portrait, laptop, wide canvas and fullscreen-style aspect ratios all fit.
  for(const aspect of [.55,1,1.35,16/9,2.8]){
    fitCamera(camera,bounds,aspect);
    assert.ok(camera.left<bounds.min.x&&camera.right>bounds.max.x);
    assert.ok(camera.bottom<bounds.min.y&&camera.top>bounds.max.y);
    assert.ok(Math.abs((camera.right-camera.left)/(camera.top-camera.bottom)-aspect)<1e-10);
    const size=bounds.getSize(new THREE.Vector2());
    const occupancy=Math.max(size.x/(camera.right-camera.left),size.y/(camera.top-camera.bottom));
    assert.ok(occupancy>.96&&occupancy<1,'scene fills the limiting canvas dimension with a small safety margin');
  }
});
