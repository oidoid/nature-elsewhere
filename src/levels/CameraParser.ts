import {Camera} from './Camera'
import {EntityIDConfig} from '../entity/EntityParser'
import {EntityIDParser} from '../entity/EntityIDParser'
import {XYConfig} from '../math/XYConfig'
import {XYParser} from '../math/XYParser'

export type CameraConfig = Maybe<
  Readonly<{position?: XYConfig; followID?: EntityIDConfig}>
>

export namespace CameraParser {
  export function parse(config: CameraConfig): Camera {
    if (!config) return new Camera()
    const position = XYParser.parse(config.position)
    const followID = EntityIDParser.parse(config.followID)
    return new Camera(position, followID)
  }
}
