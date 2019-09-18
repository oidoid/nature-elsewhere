import {ImageRectConfig} from './image-rect-config'
import {EntityStateConfig} from '../../entities/parsers/entity-state-config'

export type ImageStateMapConfig = Maybe<
  Readonly<Record<Exclude<EntityStateConfig, undefined>, ImageRectConfig>>
>
