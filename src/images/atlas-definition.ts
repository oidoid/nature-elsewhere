import * as aseprite from '../parsers/aseprite-format'
import {AnimationID} from './animation-id'

export interface AtlasDefinition {
  /** Atlas dimensions in pixels. */
  readonly size: WH
  readonly animations: AtlasAnimationMap
}

export type AtlasAnimationMap = Readonly<Record<AnimationID, AtlasAnimation>>

/** Animation and collision frames. */
export interface AtlasAnimation {
  /** Cel dimensions in pixels. */
  readonly size: WH
  readonly cels: ReadonlyArray<AtlasCel>
  /** Positive animation length in milliseconds, possibly infinite. */
  readonly duration: number
  readonly direction: AtlasAnimationDirection
}

/** A single cel of an animation sequence. */
export interface AtlasCel {
  /** Texture location within the atlas in pixels. */
  readonly position: XY
  /** Positive cel exposure in milliseconds, possibly infinite. */
  readonly duration: number
  /** Collision bounds within the texture in pixels. */
  readonly collision: ReadonlyArray<Rect>
}

export import AtlasAnimationDirection = aseprite.AnimationDirection
