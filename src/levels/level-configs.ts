import {Level} from './level'
import * as title from '../assets/levels/title.json'

export const LevelConfigs: Readonly<
  Record<string, Level.Config>
> = Object.freeze({title})
