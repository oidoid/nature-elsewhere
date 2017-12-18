import * as Three from 'three'
import {Tiled} from './types/tiled'

const map: Tiled.Map = require('../build/assets/maps/pond.json')

export const scene = new Three.Scene()
scene.background = new Three.Color(map.backgroundcolor)

const textureLoader = new Three.TextureLoader()
const textures: {[name: string]: Three.Texture} = {}

for (const tileset of map.tilesets) {
  textureLoader.load(
    'src/assets/maps/' + tileset.image,
    (texture: Three.Texture) => {
      texture.flipY = false
      texture.name = tileset.name
      textures[texture.name] = texture

      for (const layer of map.layers) {
        switch (layer.type) {
          case Tiled.LayerType.TILE_LAYER:
            const tileLayer: Tiled.TileLayer = layer as Tiled.TileLayer
            if (typeof tileLayer.data === 'string')
              throw new Error('TileLayer.data of type string is unsupported.')
            for (let i = 0; i < tileLayer.data.length; ++i) {
              if (
                tileLayer.width === undefined ||
                tileLayer.height === undefined
              ) {
                throw new Error('TileLayer.width and height must be defined.')
              }
              let index = tileLayer.data[i]
              if (index === 0) continue
              index -= 1
              const offsetTexture = textures['pond'].clone()
              offsetTexture.offset = new Three.Vector2(
                1 / 8 * (index % tileLayer.width),
                0
              )
              offsetTexture.repeat = new Three.Vector2(1 / 8, 1)
              offsetTexture.needsUpdate = true
              const spriteMaterial = new Three.SpriteMaterial({
                map: offsetTexture
              })
              const sprite = new Three.Sprite(spriteMaterial)
              sprite.position.set(
                (i % tileLayer.width) * 16 + Math.trunc(map.tilewidth / 2),
                Math.trunc(i / tileLayer.width) * 16 +
                  Math.trunc(map.tileheight / 2),
                -1
              )
              sprite.scale.set(16, 16, 1)
              scene.add(sprite)
            }
            break

          case Tiled.LayerType.OBJECT_GROUP:
            // eslint-disable-next-line max-len
            const objectGroup: Tiled.ObjectGroupLayer = layer as Tiled.ObjectGroupLayer
            for (const object of objectGroup.objects) {
              if (object.type === 'rectangle') {
                // todo: Three.PlaneGeometry
                const geometry = new Three.CubeGeometry(
                  object.width,
                  object.height,
                  0
                )
                const material = new Three.MeshBasicMaterial({
                  // todo: Three.js doesn't understand when the alpha channel is
                  // specified, ensure it's not. It's always specified for color
                  // properties but never for Map.backgroundcolor.
                  color: object.properties ? object.properties.color : undefined
                })
                const mesh = new Three.Mesh(geometry, material)
                mesh.position.set(
                  object.x + Math.trunc(object.width / 2),
                  object.y + Math.trunc(object.height / 2),
                  -1 + 1
                )
                scene.add(mesh)
              } else if (object.type === 'sprite') {
                if (object.gid === undefined) {
                  throw new Error('Object.gid must be defined.')
                }
                // todo: allow invisible tiles
                const index = object.gid ? object.gid - 1 : 0
                const offsetTexture = textures['pond'].clone()
                offsetTexture.offset = new Three.Vector2(
                  1 / 8 * (index % map.tilewidth),
                  0
                )
                offsetTexture.repeat = new Three.Vector2(1 / 8, 1)
                offsetTexture.needsUpdate = true
                const spriteMaterial = new Three.SpriteMaterial({
                  map: offsetTexture
                })
                const sprite = new Three.Sprite(spriteMaterial)
                sprite.position.set(
                  object.x + Math.trunc(object.width / 2),
                  object.y - Math.trunc(object.height / 2),
                  -4
                )
                sprite.scale.set(object.height, object.width, 1)
                scene.add(sprite)
              } else throw new Error(`Unknown object type, "${object.type}".`)
            }
            break

          case Tiled.LayerType.IMAGE_LAYER:
            throw new Error(`Unsupported layer type, "${layer.type}".`)

          case Tiled.LayerType.GROUP:
            throw new Error(`Unsupported layer type, "${layer.type}".`)

          default:
            throw new Error(`Unknown layer type, "${layer.type}".`)
        }
      }
    }
  )
}
