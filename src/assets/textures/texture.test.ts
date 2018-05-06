import * as Aseprite from './aseprite'
import * as atlasJSON from '../textures/atlas.json'
import * as fs from 'fs'
import * as TextureAtlas from './texture-atlas'
import {TEXTURE, TextureURL} from './texture'

const SRC = 'src'

describe('texture', () => {
  describe('URL', () => {
    test('Each URL exists', () => {
      Object.values(TextureURL).forEach(url => {
        expect(fs.existsSync(`${SRC}${url}`)).toEqual(true)
      })
    })
  })

  describe('atlas', () => {
    const atlas = TextureAtlas.unmarshal(<Aseprite.File>atlasJSON)

    test('Each URL _and_ ID is unique', () => {
      Object.values(TEXTURE).forEach((texture, i) => {
        expect(
          Object.values(TEXTURE).findIndex(
            ({url, id}) => url === texture.url && id === texture.id
          )
        ).toEqual(i)
      })
    })

    test('Each Texture has an Animation', () => {
      Object.values(TEXTURE).forEach(texture => {
        expect(atlas.animations).toHaveProperty(texture.id)
      })
    })

    test('Each Animation has a Texture', () => {
      Object.keys(atlas.animations).forEach(id => {
        expect(Object.values(TEXTURE)).toContainEqual(
          expect.objectContaining({id})
        )
      })
    })
  })
})
