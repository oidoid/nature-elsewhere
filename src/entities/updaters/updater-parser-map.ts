import {Updater} from './updater/updater'
import {UpdaterParser} from './updater-parser'
import {LevelLink} from '../types/level-link/level-link'
import {FollowCam} from '../types/follow-cam/follow-cam'

export namespace UpdaterParserMap {
  export const Parse: Readonly<Partial<Record<Updater, UpdaterParser>>> = {
    [Updater.UI_LEVEL_LINK]: LevelLink.parse,
    [Updater.UI_FOLLOW_CAM]: FollowCam.parse
  }
}
