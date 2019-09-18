import {LevelConfig} from './parsers/level-config'
import {LevelType} from './level-type'
import * as UI_TITLE from '../assets/levels/ui/title-level.json'
import * as UI_PAUSE from '../assets/levels/ui/pause-level.json'
import * as UI_LEVEL_EDITOR from '../assets/levels/ui/level-editor-level.json'
import * as UI_OPTIONS from '../assets/levels/ui/options-level.json'
import * as PLAY_FIELDS from '../assets/levels/play/fields-level.json'
import * as TEST_PERFORMANCE from '../assets/levels/test/performance-level.json'
import * as TEST_SHADER from '../assets/levels/test/shader-level.json'

export const LevelTypeConfigMap: Readonly<
  Partial<Record<LevelType, LevelConfig>>
> = Object.freeze({
  [LevelType.PLAY_FIELDS]: PLAY_FIELDS,
  [LevelType.UI_TITLE]: UI_TITLE,
  [LevelType.UI_OPTIONS]: UI_OPTIONS,
  [LevelType.UI_PAUSE]: UI_PAUSE,
  [LevelType.UI_LEVEL_EDITOR]: UI_LEVEL_EDITOR,
  [LevelType.TEST_PERFORMANCE]: TEST_PERFORMANCE,
  [LevelType.TEST_SHADER]: TEST_SHADER
})
