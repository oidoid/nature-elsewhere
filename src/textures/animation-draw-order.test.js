import * as util from '../util.js'
import {AnimationID} from './animation-id.js'
import {AnimationDrawOrder} from './animation-draw-order.js'

const ids = /** @type {AnimationID[]}*/ (util.values(AnimationID))

test.each(ids)('%# AnimationID %p has a DrawOrder', (
  /** @type {AnimationID}*/ id
) => expect(AnimationDrawOrder).toHaveProperty(id))

test.each(/** @type {string[]}*/ (util.keys(AnimationDrawOrder)))(
  '%# AnimationDrawOrder %p has a AnimationID',
  (/** @type {string} */ id) =>
    expect(
      ids.filter((/** @type {AnimationID} */ val) => id === val)
    ).toHaveLength(1)
)
