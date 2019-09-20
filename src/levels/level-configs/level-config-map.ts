import {LevelConfig} from '../level/level-config'
import {LevelType} from '../level-type/level-type'
import * as UI_TITLE from './ui/title-level.json'
import * as UI_PAUSE from './ui/pause-level.json'
import * as UI_LEVEL_EDITOR from './ui/level-editor-level.json'
import * as UI_OPTIONS from './ui/options-level.json'
import * as PLAY_FIELDS from './play/fields-level.json'
import * as TEST_PERFORMANCE from './test/performance-level.json'
import * as TEST_SHADER from './test/shader-level.json'

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
