import {ArrayUtil} from '../utils/array-util'
import {EntityConfigs} from './entity-configs'
import {ImageConfig} from '../images/image-config'
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

const images: readonly ImageConfig[] = Object.freeze(
  Object.values(EntityConfigs)
    .filter(ArrayUtil.is)
    .map(({states}) => states)
    .filter(ArrayUtil.is)
    .map(Object.values)
    .reduce((ret: ImageConfig[], val) => ret.concat(...val), [])
)

test.each(images)('%# image has a valid layer or no layer %p', ({layer}) => {
  if (layer) expect(layer in Layer).toBeTruthy()
  else expect(layer).toBeUndefined()
})
