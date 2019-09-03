import {ArrayUtil} from '../utils/array-util'
import {EntityConfigs} from './entity-configs'
import {Image} from '../images/image'
import {Layer} from '../images/layer'
import {ObjectUtil} from '../utils/object-util'

const ids: readonly string[] = Object.freeze(
  ObjectUtil.values(EntityConfigs)
    .filter(ArrayUtil.is)
    .map(({id}) => id)
    .filter(ArrayUtil.is)
)

test.each(ids)('%# ID %p is unique', id =>
  expect(ids.filter(val => id === val)).toHaveLength(1)
)

const images: readonly Image.Config[] = Object.freeze(
  ObjectUtil.values(EntityConfigs)
    .filter(ArrayUtil.is)
    .map(({states}) => states)
    .filter(ArrayUtil.is)
    .map(ObjectUtil.values)
    .reduce((sum: Image.Config[], val) => sum.concat(...val), [])
)

test.each(images)('%# image has a valid layer or no layer %p', ({layer}) => {
  if (layer) expect(layer in Layer).toBeTruthy()
  else expect(layer).toBeUndefined()
})
