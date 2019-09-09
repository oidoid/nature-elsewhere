import {LevelConfigs} from './level-configs'
import {ValueUtil} from '../utils/value-util'

const ids: readonly string[] = Object.freeze(
  Object.values(LevelConfigs)
    .filter(ValueUtil.is)
    .map(({id}) => id)
)

test.each(ids)('%# ID %p is unique', id =>
  expect(ids.filter(val => id === val)).toHaveLength(1)
)
