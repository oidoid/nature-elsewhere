import {UpdaterParser} from '../../updaters/updater-parser'
import {FollowCamOrientation} from './follow-cam-orientation'
import {WHParser} from '../../../math/wh/wh-parser'
import {ObjectUtil} from '../../../utils/object-util'

export namespace FollowCamParser {
  export const parse: UpdaterParser = entity => {
    const orientation =
      'positionRelativeToCam' in entity
        ? entity['positionRelativeToCam']
        : undefined
    if (
      !orientation ||
      !ObjectUtil.assertValueOf(
        FollowCamOrientation,
        orientation,
        'FollowCamOrientation'
      )
    )
      throw new Error()
    const camMargin = WHParser.parse(
      'camMargin' in entity ? entity['camMargin'] : undefined
    )
    return {...entity, orientation, camMargin}
  }
}
