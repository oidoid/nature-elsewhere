import * as Three from 'three'
import {scene} from './load-scene'

// An integer for pixel alignment.
const HEIGHT = 128

// Consistently call Math.round() on the result of width() to keep pixel
// alignment.
function width() {
  const ratio = window.innerWidth / window.innerHeight
  return HEIGHT * ratio
}

const renderer = new Three.WebGLRenderer()
// No doubling. Pixels are one for one when rendering.
renderer.setPixelRatio(1)
document.body.appendChild(renderer.domElement)

const camera = new Three.OrthographicCamera(0, 0, 0, 0)

function render(clock: Three.Clock) {
  // console.log(clock.getDelta());
  // cube.rotation.z += 0.005

  renderer.render(scene, camera)

  requestAnimationFrame(() => render(clock))
}

resize()
render(new Three.Clock())

window.addEventListener('resize', resize)

function resize() {
  // eslint-disable-next-line no-console
  console.log(
    `resize: ` +
      `window=${window.innerWidth}x${window.innerHeight} ` +
      `canvas=${Math.ceil(width())}x${HEIGHT} ` +
      `ratio=${window.innerWidth / window.innerHeight}` +
      `scale=${window.innerHeight / HEIGHT}`
  )
  renderer.setSize(Math.ceil(width()), HEIGHT)

  camera.right = Math.ceil(width())
  camera.bottom = HEIGHT
  camera.updateProjectionMatrix()
}
