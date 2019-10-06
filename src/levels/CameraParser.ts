import {XYConfig, XYParser} from '../math/XYParser'
import {Camera} from './Camera'
import {EntityIDConfig, EntityParser} from '../entity/EntityParser'

export type CameraConfig = Maybe<
  Readonly<{position?: XYConfig; followID?: EntityIDConfig}>
>

export namespace CameraParser {
  export function parse(config: CameraConfig): Camera {
    if (!config) return new Camera()
    const position = XYParser.parse(config.position)
    const followID = EntityParser.parseID(config.followID)
    return new Camera(position, followID)
  }
}
