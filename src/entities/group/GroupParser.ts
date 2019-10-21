import {FollowCamParser} from '../../updaters/FollowCamParser'
import {Group} from './Group'
import {GroupPropsConfig} from './GroupPropsConfig'

export namespace GroupParser {
  export function parseProps(config: GroupPropsConfig): Group.Props {
    const {positionRelativeToCam, camMargin} = FollowCamParser.parse(config)
    return {
      ...(positionRelativeToCam && {positionRelativeToCam}),
      ...(camMargin && {camMargin})
    }
  }
}
