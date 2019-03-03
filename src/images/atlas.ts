import {AnimationID} from './animation-id'
import {Aseprite} from '../parsers/aseprite'

export namespace Atlas {
  export interface Definition {
    /** Atlas dimensions in pixels. */
    readonly size: WH
    readonly animations: AnimationMap
  }

  export type AnimationMap = Readonly<Record<AnimationID, Animation>>

  /** Animation and collision frames. */
  export interface Animation {
    /** Cel dimensions in pixels. */
    readonly size: WH
    readonly cels: ReadonlyArray<Cel>
    /** Positive animation length in milliseconds, possibly infinite. */
    readonly duration: number
    readonly direction: AnimationDirection
  }

  /** A single cel of an animation sequence. */
  export interface Cel {
    /** Texture location within the atlas in pixels. */
    readonly position: XY
    /** Positive cel exposure in milliseconds, possibly infinite. */
    readonly duration: number
    /** Collision bounds within the texture in pixels. */
    readonly collision: ReadonlyArray<Rect>
  }

  export import AnimationDirection = Aseprite.AnimationDirection
}
