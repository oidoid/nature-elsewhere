import {EntityStateConfig} from '../../entities/entityState/EntityStateConfig'
import {ImageRectConfig} from '../imageRect/ImageRectConfig'

export type ImageStateMapConfig = Maybe<
  Readonly<Record<Exclude<EntityStateConfig, undefined>, ImageRectConfig>>
>
