import {ArrayUtil} from '../utils/array-util'
import {LevelConfigs} from './level-configs'
import {ObjectUtil} from '../utils/object-util'

const ids: readonly string[] = Object.freeze(
  ObjectUtil.values(LevelConfigs)
    .filter(ArrayUtil.is)
    .map(({id}) => id)
)

test.each(ids)('%# ID %p is unique', id =>
  expect(ids.filter(val => id === val)).toHaveLength(1)
)
