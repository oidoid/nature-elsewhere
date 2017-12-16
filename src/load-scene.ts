import * as Three from 'three'

enum CharacterType {
  rectangle = 'rectangle',
  sprite = 'sprite'
}

interface CharacterBase {
  type: CharacterType
  width: number
  height: number
  x: number
  y: number
  z: number
}

interface PrimitiveCharacter extends CharacterBase {
  color: string
}

interface SpriteCharacter extends CharacterBase {
  texture: string
}

type Character = PrimitiveCharacter | SpriteCharacter

interface SceneConfig {
  /** The background color of the scene. e.g., '#12345678'. */
  backgroundColor: string
  characters: Character[]
}

const config: SceneConfig = require('./scene.json')

export const scene = new Three.Scene()
scene.background = new Three.Color(config.backgroundColor)

config.characters.forEach(char => {
  if (char.type === CharacterType.rectangle) {
    const primitiveChar: PrimitiveCharacter = char as PrimitiveCharacter

    const geometry = new Three.BoxGeometry(char.width, char.height, 0)
    const material = new Three.MeshBasicMaterial({color: primitiveChar.color})
    const cube = new Three.Mesh(geometry, material)
    cube.position.set(char.x, char.y, char.z)
    scene.add(cube)
  } else if (char.type === CharacterType.sprite) {
    const spriteChar: SpriteCharacter = char as SpriteCharacter

    const texture = new Three.TextureLoader().load(spriteChar.texture)
    texture.flipY = false
    const spriteMaterial = new Three.SpriteMaterial({map: texture})
    const sprite = new Three.Sprite(spriteMaterial)
    sprite.position.set(char.x, char.y, char.z)
    sprite.scale.set(char.width, char.height, 1)
    scene.add(sprite)
  } else throw new Error(`Unknown character type, "${char.type}".`)
})
