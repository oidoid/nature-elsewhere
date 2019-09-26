import {ArrayUtil} from '../utils/ArrayUtil'
import * as atlasJSON from './atlas.json'
import {Aseprite} from './Aseprite'
import {AtlasID} from './AtlasID'
import {AtlasParser} from './AtlasParser'
import {ObjectUtil} from '../utils/ObjectUtil'
import {Atlas} from './Atlas'

const file: Aseprite.File = Object.freeze(atlasJSON)
const atlas: Atlas = Object.freeze(AtlasParser.parse(file))
const tags: readonly string[] = Object.freeze(
  file.meta.frameTags.map(frameTag => frameTag.name)
)
const ids: readonly AtlasID[] = Object.freeze(ObjectUtil.values(AtlasID))

test.each(tags)('%# Tag %p is unique within the sheet', tag =>
  expect(tags.filter(val => val === tag)).toHaveLength(1)
)

test.each(tags)('%# Tag %p has a Frame', tag => {
  const frameKeys = Object.keys(file.frames)
    .map(tagFrameNumber => tagFrameNumber.replace(/ [0-9]*$/, ''))
    .filter(ArrayUtil.unique(Object.is))
  expect(frameKeys).toContainEqual(tag)
})

{
  const frameKeys = Object.keys(file.frames)
    .map(tagFrameNumber => tagFrameNumber.replace(/ [0-9]*$/, ''))
    .filter(ArrayUtil.unique(Object.is))
  test.each(frameKeys)('%# Frame has a Tag %p', frameKey =>
    expect(tags).toContainEqual(frameKey)
  )
}

test.each(
  Object.values(atlas).reduce(
    (ret: Atlas.Cel[], val) => [...ret, ...val.cels],
    []
  )
)('%# duration for Cel %p is > 0', (cel: Atlas.Cel) =>
  expect(cel.duration).toBeGreaterThan(0)
)

test.each(
  Object.values(atlas).reduce(
    (ret: Atlas.Cel[], val) =>
      val.cels.length > 1 ? [...ret, ...val.cels.slice(0, -1)] : ret,
    []
  )
)('%# multi-Cel duration for Cel %p is < ∞ (except last)', cel => {
  expect(cel.duration).toBeLessThan(Number.POSITIVE_INFINITY)
})

test.each(Object.values(atlas))(
  '%# every Animation has at lease one Cel %p',
  ({cels}) => expect(cels.length).toBeGreaterThan(0)
)

test.each(ids)('%# AtlasID %p has an Animation', id =>
  expect(atlas).toHaveProperty(id)
)

test.each(ids)('%# animation ID %p has a AtlasID', id =>
  expect(ids.filter(val => id === val)).toHaveLength(1)
)
