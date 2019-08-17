import {Level} from './level'
import * as editor from '../assets/levels/editor.json'
import * as fields from '../assets/levels/fields.json'
import * as shader from '../assets/levels/shader.json'
import * as title from '../assets/levels/title.json'

export const LevelConfigs: Readonly<
  Record<string, Level.Config>
> = Object.freeze({editor, fields, shader, title})
