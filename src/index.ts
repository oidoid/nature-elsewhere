import * as Three from "three";

const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera();

const renderer = new Three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new Three.BoxGeometry(1, 1, 1);
const material = new Three.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new Three.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function render() {
  requestAnimationFrame(render);

  cube.rotation.x += 0.1;
  cube.rotation.y += 0.1;

  renderer.render(scene, camera);
}

resize();
render();

const scale = new Three.Vector3(4, 4, 1);

window.addEventListener("resize", resize);

function resize() {
  const aspect = window.innerWidth / window.innerHeight;
  // eslint-disable-next-line no-console
  console.log(
    `resize: scale=${scale} ` +
      `window=${window.innerWidth}x${window.innerHeight} ` +
      `aspect=${aspect}`
  );

  camera.aspect = aspect;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
