import {UpdaterParser} from '../../updaters/updater-parser'
import {FollowCamOrientation} from './follow-cam-orientation'
import {WHParser} from '../../../math/wh/wh-parser'

export namespace FollowCamParser {
  export const parse: UpdaterParser = entity => {
    const orientation =
      'positionRelativeToCam' in entity
        ? entity['positionRelativeToCam']
        : undefined
    if (
      !orientation ||
      !Object.values(FollowCamOrientation).includes(orientation)
    )
      throw new Error(`Invalid Orientation "${orientation}".`)
    const camMargin = WHParser.parse(
      'camMargin' in entity ? entity['camMargin'] : undefined
    )
    return {...entity, camMargin}
  }
}
