import {ImageRectConfig} from '../image-rect/image-rect-config'
import {EntityStateConfig} from '../../entities/entity-state/entity-state-config'

export type ImageStateMapConfig = Maybe<
  Readonly<Record<Exclude<EntityStateConfig, undefined>, ImageRectConfig>>
>
