import * as util from '../util.js'
import {AnimationID} from './animation-id.js'
import {AnimationLayer} from './animation-layer.js'

const ids = /** @type {AnimationID[]}*/ (util.values(AnimationID))

test.each(ids)('%# AnimationID %p has a DrawOrder', (
  /** @type {AnimationID}*/ id
) => expect(AnimationLayer).toHaveProperty(id))

test.each(/** @type {string[]}*/ (util.keys(AnimationLayer)))(
  '%# AnimationDrawOrder %p has a AnimationID',
  (/** @type {string} */ id) =>
    expect(
      ids.filter((/** @type {AnimationID} */ val) => id === val)
    ).toHaveLength(1)
)
