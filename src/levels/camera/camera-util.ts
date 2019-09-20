import {Rect} from '../../math/rect/rect'
import {Level} from '../level/level'
import {Camera} from './camera'

export namespace CameraUtil {
  export function centerOn(cam: Camera, level: Level, bounds: Rect): void {
    const {x, y} = Level.clamp(
      level,
      Rect.centerOn(cam.bounds, bounds),
      cam.bounds
    )
    cam.bounds.x = x
    cam.bounds.y = y
  }
}
