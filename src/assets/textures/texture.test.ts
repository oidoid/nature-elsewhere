import * as Aseprite from './aseprite'
import * as atlasJSON from '../textures/atlas.json'
import * as fs from 'fs'
import * as TextureAtlas from './texture-atlas'
import {ASSET_URL, TEXTURE, textureEquals} from './texture'
import {expectToContainObjectContaining} from '../../test.util.test'

describe('texture', () => {
  describe('URL', () => {
    test.each(Object.values(ASSET_URL))('URL (%s) resource exists', url => {
      const SRC_DIR = 'src'
      expect(fs.existsSync(`${SRC_DIR}${url}`)).toStrictEqual(true)
    })
  })

  describe('atlas', () => {
    const atlas = TextureAtlas.unmarshal(<Aseprite.File>atlasJSON)
    const textures = Object.values(TEXTURE)

    test.each(textures)(
      'Texture (%o) asset and ID are a unique combination',
      texture =>
        expect(
          textures.filter(val => textureEquals(val, texture)).length
        ).toStrictEqual(1)
    )

    test.each(textures)('Texture (%o) has an Animation', ({id}) =>
      expect(atlas.animations).toHaveProperty(id)
    )

    {
      const ids = Object.keys(atlas.animations)
      test.each(ids)('Animation ID (%s) has a Texture', id =>
        expectToContainObjectContaining(textures, {id})
      )
    }
  })
})
