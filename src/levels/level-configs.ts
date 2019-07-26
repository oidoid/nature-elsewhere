import {LevelConfig} from './level-config.js'
import {LevelID} from './level-id.js'
import * as title from '../assets/levels/title.json'

export const LevelConfigs: Readonly<
  Record<keyof typeof LevelID, LevelConfig>
> = Object.freeze({TITLE: title})
