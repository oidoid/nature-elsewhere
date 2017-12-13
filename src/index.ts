import * as Three from "three";

// An integer for pixel alignment.
const HEIGHT = 192;

// Consistently call Math.round() on the result of width() to keep pixel
// alignment.
function width() {
  const ratio = window.innerWidth / window.innerHeight;
  return HEIGHT * ratio;
}

const renderer = new Three.WebGLRenderer();
// No doubling. Pixels are one for one when rendering.
renderer.setPixelRatio(1);
document.body.appendChild(renderer.domElement);

const camera = new Three.OrthographicCamera(0, Math.round(width()), 0, HEIGHT);

const scene = new Three.Scene();

const texture = new Three.TextureLoader().load("assets/images/pond1.png");
texture.flipY = false;
const spriteMaterial = new Three.SpriteMaterial({ map: texture });
const sprite = new Three.Sprite(spriteMaterial);
sprite.position.set(0, 0, -1);
sprite.scale.set(128, 16, 1);
scene.add(sprite);

const geometry = new Three.BoxGeometry(10, 10, 0);
const material = new Three.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new Three.Mesh(geometry, material);
scene.add(cube);

function render(clock: Three.Clock) {
  // console.log(clock.getDelta());
  cube.rotation.z += 0.033;

  renderer.render(scene, camera);

  requestAnimationFrame(() => render(clock));
}

resize();
render(new Three.Clock());

window.addEventListener("resize", resize);

function resize() {
  // eslint-disable-next-line no-console
  console.log(
    `resize: ` +
      `window=${window.innerWidth}x${window.innerHeight} ` +
      `canvas=${Math.round(width())}x${HEIGHT} ` +
      `ratio=${window.innerWidth / window.innerHeight}`
  );
  renderer.setSize(Math.round(width()), HEIGHT);

  camera.right = Math.round(width());
  camera.position.x = Math.round(-width() / 2);
  camera.position.y = Math.round(-HEIGHT / 2);

  camera.updateProjectionMatrix();
}
