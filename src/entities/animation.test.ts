import * as asepriteParser from '../parsers/asepriteParser'
import * as animation from './animation'
import * as atlasJSON from '../assets/atlas.json'
import * as util from '../util'

const state = asepriteParser.parse(atlasJSON)
const ids = util.values(animation.ID)

test.each(ids)('%# animation ID %p is unique', (id: animation.ID) =>
  expect(ids.filter((val: animation.ID) => id === val)).toHaveLength(1)
)

test.each(ids)('%# animation %p ID has an Animation', (id: animation.ID) =>
  expect(state.animations).toHaveProperty(id)
)

test.each(util.keys(state.animations))(
  '%# Animation ID %p has a animation ID',
  (id: string) =>
    expect(ids.filter((val: animation.ID) => id === val)).toHaveLength(1)
)
