import {XYConfig, XYParser} from '../math/XYParser'
import {EntityID} from '../entity/EntityID'
import {Camera} from './Camera'
import {EntityIDConfig, EntityParser} from '../entity/EntityParser'
import {WH} from '../math/WH'
import {XY} from '../math/XY'

export type CameraConfig = Maybe<
  Readonly<{position?: XYConfig; followID?: EntityIDConfig}>
>

export namespace CameraParser {
  export function parse(config: CameraConfig): Camera {
    if (!config)
      return {
        bounds: {position: new XY(0, 0), size: new WH(0, 0)},
        followID: EntityID.ANONYMOUS
      }
    const position = XYParser.parse(config.position)
    const followID = EntityParser.parseID(config.followID)
    return {bounds: {position, size: new WH(0, 0)}, followID}
  }
}
