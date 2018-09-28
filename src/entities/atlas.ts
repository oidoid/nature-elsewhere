import * as aseprite from '../parsers/aseprite'

export type State = Readonly<{size: WH; animations: AnimationMap}>

export type AnimationMap = Readonly<Record<AnimationID, Animation>>

export type AnimationID = aseprite.Tag

/** Animation and collision frames. */
export type Animation = Readonly<{cels: Cel[]; direction: AnimationDirection}>

/** A single cel of animation sequence. */
export type Cel = Readonly<{
  /** Texture bounds within the atlas. */
  bounds: Rect
  /** Cel exposure in milliseconds, possibly infinite. */
  duration: number
  /** Collision bounds within the texture. */
  collision: Rect[]
}>

export import AnimationDirection = aseprite.Direction
