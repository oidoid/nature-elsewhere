import * as util from '../util.js'
import {EntityID} from './entity-id.js'
import {EntityLayer} from './entity-layer.js'

const ids = /** @type {EntityID[]}*/ (util.values(EntityID))

test.each(ids)('%# EntityID %p has a Layer', (/** @type {EntityID}*/ id) =>
  expect(EntityLayer).toHaveProperty(id)
)

test.each(/** @type {string[]}*/ (util.keys(EntityLayer)))(
  '%# EntityLayer %p has a EntityID',
  (/** @type {string} */ id) =>
    expect(
      ids.filter((/** @type {EntityID} */ val) => id === val)
    ).toHaveLength(1)
)
