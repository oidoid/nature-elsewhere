import {ArrayUtil} from '../utils/array-util'
import {LevelConfigs} from './level-configs'

const ids: readonly string[] = Object.freeze(
  Object.values(LevelConfigs)
    .filter(ArrayUtil.is)
    .map(({id}) => id)
)

test.each(ids)('%# ID %p is unique', id =>
  expect(ids.filter(val => id === val)).toHaveLength(1)
)
