import * as asepriteParser from '../parsers/asepriteParser.js'
import * as animation from './animationID.js'
import * as atlas from './atlas.js'
import * as util from '../util.js'
import atlasJSON from '../assets/atlas.js'

/** @type {atlas.State} */ const state = asepriteParser.parse(atlasJSON)
const ids = /** @type {animation.AnimationID[]}*/ (util.values(
  animation.AnimationID
))

test.each(ids)('%# animation ID %p is unique', (
  /** @type {animation.AnimationID}*/ id
) =>
  expect(
    ids.filter((/** @type {animation.AnimationID}*/ val) => id === val)
  ).toHaveLength(1)
)

test.each(ids)('%# animation %p ID has an Animation', (
  /** @type {animation.AnimationID}*/ id
) => expect(state.animations).toHaveProperty(id))

test.each(
  /** @type {(keyof atlas.AnimationMap)[]}*/ (util.keys(state.animations))
)('%# Animation ID %p has a animation ID', (/** @type {string} */ id) =>
  expect(
    ids.filter((/** @type {animation.AnimationID} */ val) => id === val)
  ).toHaveLength(1)
)
