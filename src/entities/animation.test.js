import * as asepriteParser from '../parsers/asepriteParser'
import * as animation from './animation'
import * as atlas from './atlas'
import atlasJSON from '../assets/atlas.js'
import * as util from '../util'

/** @type {atlas.State} */ const state = asepriteParser.parse(atlasJSON)
const ids = /** @type {animation.ID[]}*/ (util.values(animation.ID))

test.each(ids)('%# animation ID %p is unique', (
  /** @type {animation.ID}*/ id
) =>
  expect(
    ids.filter((/** @type {animation.ID}*/ val) => id === val)
  ).toHaveLength(1)
)

test.each(ids)('%# animation %p ID has an Animation', (
  /** @type {animation.ID}*/ id
) => expect(state.animations).toHaveProperty(id))

test.each(
  /** @type {(keyof atlas.AnimationMap)[]}*/ (util.keys(state.animations))
)('%# Animation ID %p has a animation ID', (/** @type {string} */ id) =>
  expect(
    ids.filter((/** @type {animation.ID} */ val) => id === val)
  ).toHaveLength(1)
)
