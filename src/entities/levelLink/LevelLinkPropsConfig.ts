import {LevelTypeConfig} from '../../levels/LevelTypeConfig'
import {TextPropsConfig} from '../text/TextPropsConfig'

export interface LevelLinkPropsConfig extends TextPropsConfig {
  readonly link?: LevelTypeConfig
}
