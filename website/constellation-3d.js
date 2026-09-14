import * as THREE from './lib/three.module.js';

// Real meshes, depth testing and physical lighting. DOM labels remain accessible.
export function createGraph(figure, nodes) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  renderer.domElement.className = 'const-webgl';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30);
  camera.position.z = 6.5;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x6e5440, 2.5));
  const key = new THREE.DirectionalLight(0xfff4e4, 4.5);
  key.position.set(-3, 5, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xc8ddff, 3);
  rim.position.set(4, 1, -2); scene.add(rim);
  const group = new THREE.Group(); scene.add(group);
  const pearl = new THREE.MeshStandardMaterial({ color: 0xf5eadb, roughness: .24, metalness: .28 });
  const copper = new THREE.MeshStandardMaterial({ color: 0xb77943, roughness: .27, metalness: .65 });
  const wire = new THREE.MeshStandardMaterial({ color: 0xc5b398, roughness: .4, metalness: .45 });
  const core = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const loop = new THREE.Mesh(new THREE.TorusGeometry(.23, .07, 16, 64), copper);
    loop.rotation.set(i * Math.PI / 3, i * Math.PI / 3, i * Math.PI / 3);
    core.add(loop);
  }
  group.add(core);
  const positions = new Map();
  const balls = [];
  for (const node of nodes) {
    const p = new THREE.Vector3(node.unit.x, node.unit.y, node.unit.z).multiplyScalar(node.kind === 'out' ? 1.42 : 1.22);
    positions.set(node, p);
    if (node.kind === 'out') continue;
    const ball = new THREE.Mesh(new THREE.SphereGeometry(node.kind === 'inst' ? .10 : .065, 24, 16), node.kind === 'inst' ? copper : pearl);
    ball.position.copy(p); group.add(ball); balls.push(ball);
    const path = new THREE.QuadraticBezierCurve3(new THREE.Vector3(), p.clone().multiplyScalar(.55).add(new THREE.Vector3(0, .15, .12)), p);
    group.add(new THREE.Mesh(new THREE.TubeGeometry(path, 24, .006, 6, false), wire));
  }
  // A structural orbit makes the changing silhouette and rear hemisphere legible.
  const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.22, .009, 8, 128), wire);
  orbit.rotation.x = Math.PI / 2; group.add(orbit);
  let width = 0, height = 0;
  const projected = new THREE.Vector3();
  let failed = false;
  renderer.domElement.addEventListener('webglcontextlost', event => {
    event.preventDefault(); failed = true; figure.classList.remove('has-webgl');
  });
  renderer.domElement.addEventListener('webglcontextrestored', () => { failed = false; figure.classList.add('has-webgl'); });
  figure.prepend(renderer.domElement);
  figure.classList.add('has-webgl');
  return {
    render(yaw, pitch, w, h) {
      if (failed || !w || !h) return false;
      if (w !== width || h !== height) {
        width = w; height = h; renderer.setSize(w, h, false);
        camera.aspect = w / h;
        group.scale.y = 1.4;
        group.scale.x = Math.min(1.5, Math.max(1, camera.aspect * .85));
        // Widen the network without stretching the spherical node geometry.
        for (const ball of balls) ball.scale.set(1 / group.scale.x, 1 / group.scale.y, 1);
        camera.position.z = Math.max(5.3, 4.6 / camera.aspect);
        camera.updateProjectionMatrix();
      }
      group.rotation.set(pitch, yaw, 0, 'XYZ');
      group.updateMatrixWorld(true);
      renderer.render(scene, camera);
      return true;
    },
    project(node) {
      projected.copy(positions.get(node)).applyMatrix4(group.matrixWorld);
      const depth = (projected.z / 1.5 + 1) / 2;
      projected.project(camera);
      return { x: (projected.x + 1) * width / 2, y: (1 - projected.y) * height / 2, depth };
    }
  };
}
