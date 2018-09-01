import * as atlasJSON from '../textures/atlas.json'
import * as fs from 'fs'
import * as TextureAtlas from './texture-atlas'
import {ASSET_URL, TEXTURE, textureEquals, Texture} from './texture'
import {expectToContainObjectContaining} from '../../test.util.test'
import {TextureAssetID} from '../asset-loader'
import {keys} from '../../util'

describe('texture', () => {
  describe('ASSET_URL', () => {
    test.each(Object.values(ASSET_URL))(
      '%# URL (%s) resource exists',
      (url: string) => {
        const SRC_DIR = 'src'
        expect(fs.existsSync(`${SRC_DIR}${url}`)).toStrictEqual(true)
      }
    )
  })

  describe('TEXTURE', () => {
    const atlas = TextureAtlas.unmarshal(atlasJSON)
    const textures = Object.values(TEXTURE)

    test.each(textures)(
      '%# Texture (%o) asset and ID are a unique combination',
      (texture: Texture) =>
        expect(
          textures.filter(val => textureEquals(val, texture))
        ).toHaveLength(1)
    )

    test.each(textures)(
      '%# Texture (%o) AssetID exists',
      ({textureAssetID}: Texture) =>
        expect(TextureAssetID).toHaveProperty(textureAssetID.toString())
    )

    test.each(textures)(
      '%# Texture (%o) ID has an Animation',
      ({textureID}: Texture) =>
        expect(atlas.animations).toHaveProperty(textureID)
    )

    {
      const ids = keys(atlas.animations)
      test.each(ids)(
        '%# Animation ID (%s) has a Texture',
        (textureID: string) =>
          expectToContainObjectContaining(textures, {textureID})
      )
    }
  })
})
