import {EntityConfig} from '../../entity/EntityConfig'
import {FollowCamConfig, FollowCamParser} from '../../updaters/FollowCamParser'
import {Group} from './Group'

export interface GroupPropsConfig extends FollowCamConfig, EntityConfig {}

export namespace GroupParser {
  export function parseProps(config: GroupPropsConfig): Group.Props {
    const {positionRelativeToCam, camMargin} = FollowCamParser.parse(config)
    return {
      ...(positionRelativeToCam && {positionRelativeToCam}),
      ...(camMargin && {camMargin})
    }
  }
}
