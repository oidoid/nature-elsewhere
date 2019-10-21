import * as FIELDS from './fieldsLevel.json'
import * as LEVEL_EDITOR from './levelEditorLevel.json'
import * as LEVEL_EDITOR_MENU from './levelEditorMenuLevel.json'
import * as OPTIONS from './optionsLevel.json'
import * as PAUSE from './pauseLevel.json'
import * as TEST_PERFORMANCE from './performanceLevel.json'
import * as TEST_SHADER from './shaderLevel.json'
import * as TITLE from './titleLevel.json'
import {LevelConfig} from '../LevelConfig'
import {LevelType} from '../LevelType'

export const LevelConfigMap: Readonly<Record<
  LevelType,
  Maybe<LevelConfig>
>> = Object.freeze({
  [LevelType.FIELDS]: FIELDS,
  [LevelType.TITLE]: TITLE,
  [LevelType.OPTIONS]: OPTIONS,
  [LevelType.PAUSE]: PAUSE,
  [LevelType.LEVEL_EDITOR]: LEVEL_EDITOR,
  [LevelType.LEVEL_EDITOR_MENU]: LEVEL_EDITOR_MENU,
  [LevelType.TEST_PERFORMANCE]: TEST_PERFORMANCE,
  [LevelType.TEST_SHADER]: TEST_SHADER,
  [LevelType.BACK]: undefined,
  [LevelType.EXIT]: undefined
})
