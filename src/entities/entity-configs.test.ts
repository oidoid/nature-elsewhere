import {ArrayUtil} from '../utils/array-util'
import {EntityConfigs} from './entity-configs'
import {ImageConfig} from '../images/image-config'
import {Layer} from '../images/layer'
import {ObjectUtil} from '../utils/object-util'

const ids: readonly string[] = Object.freeze(
  ObjectUtil.values(EntityConfigs)
    .filter(ArrayUtil.is)
    .map(({id}) => id)
)

test.each(ids)('%# ID %p is unique', id =>
  expect(ids.filter(val => id === val)).toHaveLength(1)
)

const images: readonly ImageConfig[] = Object.freeze(
  ObjectUtil.values(EntityConfigs)
    .filter(ArrayUtil.is)
    .map(({images}) => images)
    .filter(ArrayUtil.is)
    .reduce((sum, val) => [...sum, ...val])
)

test.each(images)('%# image has a valid layer or no layer %p', ({layer}) => {
  if (layer) expect(layer in Layer).toBeTruthy()
  else expect(layer).toBeUndefined()
})
