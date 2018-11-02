import * as util from '../util.js'
import {AnimationID} from '../assets/animation-id.js'
import {EntityID} from './entity-id.js'

const ids = /** @type {EntityID[]}*/ (util.values(EntityID))

test.each(ids)('%# EntityID %p is unique', (/** @type {EntityID}*/ id) =>
  expect(ids.filter((/** @type {EntityID}*/ val) => id === val)).toHaveLength(1)
)

test.each(ids)("%# EntityID %p doesn't collide with AnimationID", (
  /** @type {EntityID}*/ id
) => expect(util.values(AnimationID)).not.toContain(id))
