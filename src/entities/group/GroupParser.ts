import {Group} from './Group'
import {
  FollowCamConfig,
  FollowCamParser
} from '../../updaters/followCam/FollowCamParser'
import {EntityConfig} from '../../entity/EntityParser'

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
