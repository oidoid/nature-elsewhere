import {ImageRectConfig} from '../imageRect/ImageRectConfig'
import {EntityStateConfig} from '../../entities/entityState/EntityStateConfig'

export type ImageStateMapConfig = Maybe<
  Readonly<Record<Exclude<EntityStateConfig, undefined>, ImageRectConfig>>
>
