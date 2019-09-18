import {Camera} from '../camera'
import {CameraConfig} from './camera-config'
import {EntityIDParser} from '../../entities/parsers/entity-id-parser'
import {XYParser} from '../../math/parsers/xy-parser'
import {EntityID} from '../../entities/entity-id'

export namespace CameraParser {
  export function parse(config: CameraConfig): Camera {
    if (!config)
      return {bounds: {x: 0, y: 0, w: 0, h: 0}, followID: EntityID.ANONYMOUS}
    const position = XYParser.parse(config.position)
    const followID = EntityIDParser.parse(config.followID)
    return {bounds: {...position, w: 0, h: 0}, followID}
  }
}
