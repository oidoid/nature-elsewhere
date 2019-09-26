import {EntityIDConfig} from '../../entities/entityID/EntityIDConfig'
import {XYConfig} from '../../math/xy/XYParser'

export type CameraConfig = Maybe<
  Readonly<{position?: XYConfig; followID?: EntityIDConfig}>
>
