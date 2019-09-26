import {LevelType} from '../LevelType'
import * as UI_TITLE from './titleLevel.json'
import * as UI_PAUSE from './pauseLevel.json'
import * as UI_LEVEL_EDITOR from './levelEditorLevel.json'
import * as UI_OPTIONS from './optionsLevel.json'
import * as PLAY_FIELDS from './fieldsLevel.json'
import * as TEST_PERFORMANCE from './performanceLevel.json'
import * as TEST_SHADER from './shaderLevel.json'
import {LevelConfig} from '../LevelParser'

export const LevelConfigMap: Readonly<
  Record<LevelType, Maybe<LevelConfig>>
> = Object.freeze({
  [LevelType.PLAY_FIELDS]: PLAY_FIELDS,
  [LevelType.UI_TITLE]: UI_TITLE,
  [LevelType.UI_OPTIONS]: UI_OPTIONS,
  [LevelType.UI_PAUSE]: UI_PAUSE,
  [LevelType.UI_LEVEL_EDITOR]: UI_LEVEL_EDITOR,
  [LevelType.TEST_PERFORMANCE]: TEST_PERFORMANCE,
  [LevelType.TEST_SHADER]: TEST_SHADER,
  [LevelType.UI_EXIT]: undefined
})
