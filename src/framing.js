import * as THREE from 'three';

// Measure projected objects, rather than projecting a mostly empty warehouse-sized box.
// Include hidden pickup/check labels so selecting or collecting never changes the zoom.
export function warehouseBounds(scene, camera, width, height) {
  scene.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);
  const bounds = new THREE.Box2();
  const include = point => {
    point.applyMatrix4(camera.matrixWorldInverse);
    bounds.expandByPoint(new THREE.Vector2(point.x, point.y));
  };
  scene.traverse(object => {
    if (object.isSprite) {
      const center = object.getWorldPosition(new THREE.Vector3()).applyMatrix4(camera.matrixWorldInverse);
      const scale = object.getWorldScale(new THREE.Vector3());
      bounds.expandByPoint(new THREE.Vector2(center.x - scale.x / 2, center.y - scale.y / 2));
      bounds.expandByPoint(new THREE.Vector2(center.x + scale.x / 2, center.y + scale.y / 2));
    } else if (object.isMesh) {
      object.geometry.computeBoundingBox();
      const box = object.geometry.boundingBox;
      for (const x of [box.min.x, box.max.x]) for (const y of [box.min.y, box.max.y]) for (const z of [box.min.z, box.max.z]) include(new THREE.Vector3(x,y,z).applyMatrix4(object.matrixWorld));
    }
  });
  // Reserve clearance for the moving robot at all four outer grid corners.
  for (const x of [-.32, width - 1 + .32]) for (const z of [-.32, height - 1 + .32]) for (const y of [.05, .98]) include(new THREE.Vector3(x,y,z));
  return bounds;
}

export function fitCamera(camera, bounds, aspect, padding = 1.035) {
  const size = bounds.getSize(new THREE.Vector2()), center = bounds.getCenter(new THREE.Vector2());
  const halfHeight = Math.max(size.y / 2, size.x / (2 * aspect)) * padding;
  camera.left = center.x - halfHeight * aspect; camera.right = center.x + halfHeight * aspect;
  camera.top = center.y + halfHeight; camera.bottom = center.y - halfHeight;
  camera.updateProjectionMatrix();
}
