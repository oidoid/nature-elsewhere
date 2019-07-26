import * as ArrayUtil from '../utils/array-util'
import {EntityConfig} from '../entities/entity-config'
import {EntityID} from '../entities/entity-id'
import {LevelConfigs} from './level-configs'
import {LevelID} from './level-id'
import * as ObjectUtil from '../utils/object-util'

const ids: readonly string[] = Object.freeze(
  ObjectUtil.values(LevelConfigs)
    .filter(ArrayUtil.is)
    .map(({id}) => id)
)

test.each(ids)('%# ID %p is an EntityID key', id =>
  expect(id in LevelID).toBeTruthy()
)

test.each(ids)('%# ID %p is unique', id =>
  expect(ids.filter(val => id === val)).toHaveLength(1)
)

const entities: readonly EntityConfig[] = Object.freeze(
  ObjectUtil.values(LevelConfigs)
    .filter(ArrayUtil.is)
    .map(({entities}) => entities)
    .filter(ArrayUtil.is)
    .reduce((sum, val) => [...sum, ...val])
)

test.each(entities)('%# entity has a valid ID %p', ({id}) =>
  expect(id in EntityID).toBeTruthy()
)
