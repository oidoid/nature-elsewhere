import {EntityIDConfig} from '../../entities/parsers/entity-id-config'
import {XYConfig} from '../../math/parsers/xy-config'

export type CameraConfig = Maybe<
  Readonly<{position?: XYConfig; followID?: EntityIDConfig}>
>
