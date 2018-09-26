import * as atlasJSON from './atlas.json'
import * as asepriteParser from './asepriteParser'
import * as animation from './animation'
import * as util from '../util'

describe('animation', () => {
  const atlas = asepriteParser.parse(atlasJSON)
  const textures = Object.values(animation.ID)

  test.each(textures)('%# animation ID %p is unique', (id: animation.ID) =>
    expect(textures.filter((val: animation.ID) => id === val)).toHaveLength(1)
  )

  test.each(textures)(
    '%# animation %p ID has an Animation',
    (id: animation.ID) => expect(atlas.animations).toHaveProperty(id)
  )

  {
    const ids = util.keys(atlas.animations)
    test.each(ids)('%# Animation ID %p has a animation ID', (id: string) =>
      expect(textures.filter((val: animation.ID) => id === val)).toHaveLength(1)
    )
  }
})
