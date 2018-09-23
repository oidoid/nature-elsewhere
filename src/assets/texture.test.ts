import * as atlasJSON from './atlas.json'
import * as asepriteParser from './asepriteParser'
import * as texture from './texture'
import * as util from '../util'

describe('texture', () => {
  const atlas = asepriteParser.parse(atlasJSON)
  const textures = Object.values(texture.ID)

  test.each(textures)('%# texture ID %p is unique', (id: texture.ID) =>
    expect(textures.filter((val: texture.ID) => id === val)).toHaveLength(1)
  )

  test.each(textures)('%# texture %p ID has an Animation', (id: texture.ID) =>
    expect(atlas.animations).toHaveProperty(id)
  )

  {
    const ids = util.keys(atlas.animations)
    test.each(ids)('%# Animation ID %p has a texture ID', (id: string) =>
      expect(textures.filter((val: texture.ID) => id === val)).toHaveLength(1)
    )
  }
})
