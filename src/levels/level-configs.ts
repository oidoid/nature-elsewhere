import {LevelConfig} from './level-config'
import * as title from '../assets/levels/title.json'

export const LevelConfigs: Readonly<
  Record<string, LevelConfig>
> = Object.freeze({title})
