import {Build} from '../utils/Build'
import {WindowModeSetting} from './WindowModeSettings'
import {ZoomMultiplierSetting} from './ZoomMultiplierSettings'

export interface Settings {
  readonly zoomMultiplier: ZoomMultiplierSetting
  readonly windowMode: WindowModeSetting
}

export namespace Settings {
  export const defaults: Settings = Object.freeze({
    zoomMultiplier: ZoomMultiplierSetting.MAX,
    windowMode: Build.dev
      ? WindowModeSetting.WINDOWED
      : WindowModeSetting.FULLSCREEN
  })
}
