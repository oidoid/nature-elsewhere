import {LevelType} from '../levelType/LevelType'
import * as UI_TITLE from './ui/titleLevel.json'
import * as UI_PAUSE from './ui/pauseLevel.json'
import * as UI_LEVEL_EDITOR from './ui/levelEditorLevel.json'
import * as UI_OPTIONS from './ui/optionsLevel.json'
import * as PLAY_FIELDS from './play/fieldsLevel.json'
import * as TEST_PERFORMANCE from './test/performanceLevel.json'
import * as TEST_SHADER from './test/shaderLevel.json'
import {LevelConfig} from '../level/LevelParser'

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
