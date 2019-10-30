import {EntityConfig} from '../../entity/EntityConfig'
import {SpriteConfig} from '../../sprite/SpriteConfig'
import {WHConfig} from '../../math/WHConfig'

export interface NinePatchPropsConfig extends EntityConfig {
  readonly size?: WHConfig
  readonly patches?: PatchesConfig
}

export interface PatchesConfig {
  readonly o?: SpriteConfig
  readonly n?: SpriteConfig
  readonly e?: SpriteConfig
  readonly s?: SpriteConfig
  readonly w?: SpriteConfig
  readonly ne?: SpriteConfig
  readonly se?: SpriteConfig
  readonly sw?: SpriteConfig
  readonly nw?: SpriteConfig
}
