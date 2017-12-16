import * as Three from 'three'

export const scene = new Three.Scene()

const texture = new Three.TextureLoader().load('assets/textures/pond.png')
texture.flipY = false
const spriteMaterial = new Three.SpriteMaterial({map: texture})
const sprite = new Three.Sprite(spriteMaterial)
sprite.position.set(0, 0, -1)
sprite.scale.set(128, 16, 1)
scene.add(sprite)

const geometry = new Three.BoxGeometry(5, 5, 0)
const material = new Three.MeshBasicMaterial({color: 0xffffcd})
export const cube = new Three.Mesh(geometry, material)
cube.position.set(20, -30, 0)
scene.add(cube)

scene.background = new Three.Color(0xf4f4ed)
