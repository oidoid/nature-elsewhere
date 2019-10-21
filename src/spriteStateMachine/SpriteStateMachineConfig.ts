import {EntityStateConfig} from '../entity/EntityParser'
import {SpriteRectConfig} from './SpriteRectConfig'

export type SpriteStateMapConfig = Maybe<
  Readonly<Record<Exclude<EntityStateConfig, undefined>, SpriteRectConfig>>
>
