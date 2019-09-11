import * as editor from '../assets/levels/editor-level.json'
import * as entities from '../assets/levels/entities-level.json'
import * as fields from '../assets/levels/fields-level.json'
import {LevelConfig} from './level-config'
import * as shader from '../assets/levels/shader-level.json'
import * as title from '../assets/levels/title-level.json'

export const LevelConfigs: Readonly<
  Record<string, LevelConfig>
> = Object.freeze({editor, entities, fields, shader, title})
