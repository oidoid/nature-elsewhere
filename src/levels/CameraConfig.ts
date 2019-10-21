import {EntityIDConfig} from '../entity/EntityIDConfig'
import {XYConfig} from '../math/XYConfig'

export type CameraConfig = Maybe<
  Readonly<{position?: XYConfig; followID?: EntityIDConfig}>
>
