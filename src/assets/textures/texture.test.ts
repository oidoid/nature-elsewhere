import * as Aseprite from './aseprite'
import * as atlasJSON from '../textures/atlas.json'
import * as fs from 'fs'
import * as TextureAtlas from './texture-atlas'
import {ASSET_URL, TEXTURE, textureEquals} from './texture'
import {expectToContainObjectContaining} from '../../test.util.test'
import {TextureAssetID} from '../asset-loader'
import {keys} from '../../util'

describe('texture', () => {
  describe('ASSET_URL', () => {
    test.each(Object.values(ASSET_URL))('URL (%s) resource exists', url => {
      const SRC_DIR = 'src'
      expect(fs.existsSync(`${SRC_DIR}${url}`)).toStrictEqual(true)
    })
  })

  describe('TEXTURE', () => {
    const atlas = TextureAtlas.unmarshal(<Aseprite.File>atlasJSON)
    const textures = Object.values(TEXTURE)

    test.each(textures)(
      'Texture (%o) asset and ID are a unique combination',
      texture =>
        expect(
          textures.filter(val => textureEquals(val, texture))
        ).toHaveLength(1)
    )

    test.each(textures)('Texture (%o) AssetID exists', ({textureAssetID}) =>
      expect(TextureAssetID).toHaveProperty(textureAssetID.toString())
    )

    test.each(textures)('Texture (%o) ID has an Animation', ({textureID}) =>
      expect(atlas.animations).toHaveProperty(textureID)
    )

    {
      const ids = keys(atlas.animations)
      test.each(ids)('Animation ID (%s) has a Texture', textureID =>
        expectToContainObjectContaining(textures, {textureID})
      )
    }
  })
})
