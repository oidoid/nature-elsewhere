import {LevelConfig} from './level-config.js'
import * as title from '../assets/levels/title.json'

export const LevelConfigs: Readonly<
  Record<string, LevelConfig>
> = Object.freeze({TITLE: title})
