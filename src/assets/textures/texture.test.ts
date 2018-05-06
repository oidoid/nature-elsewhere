import * as Aseprite from './aseprite'
import * as atlasJSON from '../textures/atlas.json'
import * as fs from 'fs'
import * as TextureAtlas from './texture-atlas'
import {TEXTURE, TextureURL, textureEquals} from './texture'
import {
  expectToContainSet,
  expectToContainObjectContaining
} from '../../test.util.test'

const SRC = 'src'

describe('texture', () => {
  describe('URL', () => {
    test('Each URL exists', () => {
      Object.values(TextureURL).forEach(url =>
        expect(fs.existsSync(`${SRC}${url}`)).toEqual(true)
      )
    })
  })

  describe('atlas', () => {
    const atlas = TextureAtlas.unmarshal(<Aseprite.File>atlasJSON)

    test('Each URL _and_ ID is unique', () => {
      expectToContainSet(Object.values(TEXTURE), textureEquals)
    })

    test('Each Texture has an Animation', () => {
      Object.values(TEXTURE).forEach(({id}) =>
        expect(atlas.animations).toHaveProperty(id)
      )
    })

    test('Each Animation has a Texture', () => {
      const textures = Object.values(TEXTURE)
      Object.keys(atlas.animations).forEach(id =>
        expectToContainObjectContaining(textures, {id})
      )
    })
  })
})
