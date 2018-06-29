import * as Aseprite from './aseprite'
import {Rect, WH} from '../../types/geo'

/** A sprite sheet or composite texture. */
export type TextureAtlas = {
  readonly size: WH
  readonly animations: AnimationMap
}

export type AnimationMap = {readonly [textureID in TextureID]: Animation}

export type TextureID = Aseprite.Tag

/** Animation and collision frames. */
export type Animation = {
  readonly cels: Cel[]
  readonly direction: Aseprite.Direction
}

export type Direction = Aseprite.Direction

/** A single cel of animation sequence. */
export type Cel = {
  /** Texture bounds within the atlas. */
  readonly bounds: Rect
  /** Animation length in milliseconds, possibly infinite. */
  readonly duration: number
  /** Collision bounds within the texture. */
  readonly collision: Rect[]
}

// todo: don't version build products like atlas.json and atlas.png.
// todo: process / unmarshal at compilation time instead of at runtime and share
//       the same TextureAtlas type definition between compilation code and
//       runtime code.
export function unmarshal(file: Aseprite.File): TextureAtlas {
  return {
    size: file.meta.size,
    animations: unmarshalAnimations(
      file.meta.frameTags,
      file.frames,
      file.meta.slices
    )
  }
}

export function unmarshalAnimations(
  frameTags: Aseprite.FrameTag[],
  frames: Aseprite.FrameMap,
  slices: Aseprite.Slice[]
): AnimationMap {
  return (
    frameTags
      // Animations[]
      .map(frameTag => ({
        [frameTag.name]: unmarshalAnimation(frameTag, frames, slices)
      }))
      .reduce((sum, animations) => ({...sum, ...animations}), {}) // Animations
  )
}

export function unmarshalAnimation(
  frameTag: Aseprite.FrameTag,
  frames: Aseprite.FrameMap,
  slices: Aseprite.Slice[]
): Animation {
  const cels = []
  for (
    let frameNumber = frameTag.from;
    frameNumber <= frameTag.to;
    ++frameNumber
  ) {
    let tagFrameNumber = marshalTagFrameNumber(frameTag.name, frameNumber)
    let frame = frames[tagFrameNumber]
    if (!frameNumber && frame === undefined) {
      // https://github.com/aseprite/aseprite/issues/1713
      tagFrameNumber = marshalTagFrameNumber(frameTag.name)
      frame = frames[tagFrameNumber]
    }
    const cel = unmarshalCel(frameTag, frame, frameNumber, slices)
    cels.push(cel)
  }

  return {cels, direction: frameTag.direction}
}

export function marshalTagFrameNumber(
  textureID: TextureID,
  index?: number
): Aseprite.TagFrameNumber {
  return `${textureID} ${index === undefined ? '' : index}`
}

export function unmarshalCel(
  frameTag: Aseprite.FrameTag,
  frame: Aseprite.Frame,
  frameNumber: number,
  slices: Aseprite.Slice[]
): Cel {
  return {
    bounds: unmarshalTexture(frame),
    duration: unmarshalDuration(frame.duration),
    collision: unmarshalCollision(frameTag, frameNumber, slices)
  }
}

export function unmarshalTexture(frame: Aseprite.Frame): Rect {
  const padding = unmarshalPadding(frame)
  return {
    x: frame.frame.x + padding.w / 2,
    y: frame.frame.y + padding.h / 2,
    w: frame.sourceSize.w,
    h: frame.sourceSize.h
  }
}

export function unmarshalPadding(frame: Aseprite.Frame): WH {
  return {
    w: frame.frame.w - frame.sourceSize.w,
    h: frame.frame.h - frame.sourceSize.h
  }
}

export function unmarshalDuration(duration: Aseprite.Duration): number {
  return duration === Aseprite.INFINITE_DURATION
    ? Number.POSITIVE_INFINITY
    : duration
}

export function unmarshalCollision(
  frameTag: Aseprite.FrameTag,
  frameNumber: number,
  slices: Aseprite.Slice[]
): Rect[] {
  const offset = frameNumber - frameTag.from
  return (
    slices
      // Filter out Slices not for this Tag.
      .filter(slice => slice.name === frameTag.name)
      // For each Slice, get the greatest relevant Key (as a Key[]).
      .map(slice => slice.keys.filter(key => key.frame <= offset).slice(-1))
      .reduce((sum, keys) => sum.concat(keys), []) // Key[]
      .map(key => key.bounds) // Bounds
  )
}
