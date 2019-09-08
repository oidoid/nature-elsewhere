import {ArrayUtil} from '../utils/array-util'
import {EntityConfigs} from './entity-configs'
import {Image} from '../images/image'
import {Layer} from '../images/layer'

const ids: readonly string[] = Object.freeze(
  Object.values(EntityConfigs)
    .filter(ArrayUtil.is)
    .map(({id}) => id)
    .filter(ArrayUtil.is)
)

test.each(ids)('%# ID %p is unique', id =>
  expect(ids.filter(val => id === val)).toHaveLength(1)
)

const images: readonly Image.Config[] = Object.freeze(
  Object.values(EntityConfigs)
    .filter(ArrayUtil.is)
    .map(({states}) => states)
    .filter(ArrayUtil.is)
    .map(Object.values)
    .reduce((sum: Image.Config[], val) => sum.concat(...val), [])
)

test.each(images)('%# image has a valid layer or no layer %p', ({layer}) => {
  if (layer) expect(layer in Layer).toBeTruthy()
  else expect(layer).toBeUndefined()
})
