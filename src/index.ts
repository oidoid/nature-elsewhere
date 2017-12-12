import * as Three from "three";

const HEIGHT = 192;

function width() {
  const ratio = window.innerWidth / window.innerHeight;
  return HEIGHT * ratio;
}

const renderer = new Three.WebGLRenderer();
// No smoothing. Pixels are one for one when rendering.
renderer.setPixelRatio(1);
document.body.appendChild(renderer.domElement);

const camera = new Three.OrthographicCamera(0, width(), 0, HEIGHT);

const geometry = new Three.BoxGeometry(10, 10, 10);
const material = new Three.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new Three.Mesh(geometry, material);
const scene = new Three.Scene();
scene.add(cube);

function render() {
  requestAnimationFrame(render);

  cube.rotation.z += 0.033;

  renderer.render(scene, camera);
}

resize();
render();

window.addEventListener("resize", resize);

function resize() {
  // eslint-disable-next-line no-console
  console.log(
    `resize: ` +
      `window=${window.innerWidth}x${window.innerHeight} ` +
      `canvas=${width()}x${HEIGHT} ` +
      `ratio=${window.innerWidth / window.innerHeight}`
  );
  renderer.setSize(width(), HEIGHT);

  camera.right = width();
  camera.bottom = HEIGHT;
  camera.position.x = -width() / 2;
  camera.position.y = -HEIGHT / 2;

  camera.updateProjectionMatrix();
}
