import {LevelConfig} from '../level/level-config'
import {LevelType} from '../level-type/level-type'
import * as UI_TITLE from '../level-configs/ui/title-level.json'
import * as UI_PAUSE from '../level-configs/ui/pause-level.json'
import * as UI_LEVEL_EDITOR from '../level-configs/ui/level-editor-level.json'
import * as UI_OPTIONS from '../level-configs/ui/options-level.json'
import * as PLAY_FIELDS from '../level-configs/play/fields-level.json'
import * as TEST_PERFORMANCE from '../level-configs/test/performance-level.json'
import * as TEST_SHADER from '../level-configs/test/shader-level.json'

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
