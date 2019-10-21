import {Camera} from './Camera'
import {CameraConfig} from './CameraConfig'
import {EntityIDParser} from '../entity/EntityIDParser'
import {XYParser} from '../math/XYParser'

export namespace CameraParser {
  export function parse(config: CameraConfig): Camera {
    if (!config) return new Camera()
    const position = XYParser.parse(config.position)
    const followID = EntityIDParser.parse(config.followID)
    return new Camera(position, followID)
  }
}
