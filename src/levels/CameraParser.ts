import {XYParser, XYConfig} from '../math/XYParser'
import {EntityID} from '../entity/EntityID'
import {Camera} from './Camera'
import {EntityIDConfig, EntityIDParser} from '../entity/EntityIDParser'

export type CameraConfig = Maybe<
  Readonly<{position?: XYConfig; followID?: EntityIDConfig}>
>

export namespace CameraParser {
  export function parse(config: CameraConfig): Camera {
    if (!config)
      return {
        bounds: {position: {x: 0, y: 0}, size: {w: 0, h: 0}},
        followID: EntityID.ANONYMOUS
      }
    const position = XYParser.parse(config.position)
    const followID = EntityIDParser.parse(config.followID)
    return {bounds: {position, size: {w: 0, h: 0}}, followID}
  }
}
