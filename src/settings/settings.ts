import {WindowModeSetting} from './window-mode-setting'
import {ZoomMultiplierSetting} from './zoom-multiplier-setting'

export interface State {
  readonly zoomMultiplier: ZoomMultiplierSetting
  readonly windowMode: WindowModeSetting
}

export const defaults: State = Object.freeze({
  zoomMultiplier: ZoomMultiplierSetting.MAX,
  windowMode:
    process.env.NODE_ENV === 'development'
      ? WindowModeSetting.WINDOWED
      : WindowModeSetting.FULLSCREEN
})
