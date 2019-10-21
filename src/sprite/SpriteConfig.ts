import {AnimatorConfig} from './AnimatorConfig'
import {AtlasIDConfig} from '../atlas/AtlasIDParser'
import {SpriteCompositionConfig} from './SpriteCompositionConfig'
import {Integer, Milliseconds} from 'aseprite-atlas'
import {LayerConfig} from './LayerConfig'
import {RectConfig} from '../math/RectConfig'
import {WHConfig} from '../math/WHConfig'
import {XYConfig} from '../math/XYConfig'

/** See Sprite.Props. */
export interface SpriteConfig {
  readonly id: AtlasIDConfig
  readonly constituentID?: AtlasIDConfig
  readonly composition?: SpriteCompositionConfig
  readonly bounds?: RectConfig
  readonly position?: XYConfig
  readonly x?: Integer
  readonly y?: Integer
  readonly size?: WHConfig
  readonly w?: Integer
  readonly h?: Integer
  readonly layer?: LayerConfig
  readonly scale?: XYConfig
  readonly sx?: Integer
  readonly sy?: Integer
  readonly animator?: AnimatorConfig
  readonly period?: Integer
  readonly exposure?: Milliseconds
  readonly wrap?: XYConfig // Decamillipixel
  readonly wx?: Integer // Decamillipixel
  readonly wy?: Integer // Decamillipixel
  readonly wrapVelocity?: XYConfig // Decamillipixel
  readonly wvx?: Integer // Decamillipixel
  readonly wvy?: Integer // Decamillipixel
}
