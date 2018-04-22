// A pretty tight coupling to the underlying Aseprite format for simplicity. The
// existing format is close enough to what's needed but indexing from tag to
// animation is much more intuitive than indexing from tag and frame number to
// frame, an array of collision data that must be mapped back to frames, and a
// similar array of frame tags.

import * as Aseprite from './aseprite'

export type TextureAtlas = {
  size: Aseprite.WH
  animations: Animations
}

/** @type {Object.<Aseprite.Tag, Animation>} */
export type Animations = {[tag: string]: Animation}

/** Animation and collision frames. */
export type Animation = {
  frames: Frame[]
  direction: Aseprite.Direction
}

export type Frame = {
  /** Texture bounds within the atlas. */
  texture: Aseprite.Rect
  /** Animation length in milliseconds, possibly infinite. */
  duration: number
  /** Collision within the texture. */
  collision: Aseprite.Rect[]
}

export function unmarshal(file: Aseprite.File): TextureAtlas {
  return {
    size: file.meta.size,
    animations: unmarshalAnimations(file)
  }
}

export function unmarshalAnimations(file: Aseprite.File): Animations {
  return (
    file.meta.frameTags // FrameTag[]
      // Animations[]
      .map(frameTag => ({[frameTag.name]: unmarshalAnimation(file, frameTag)}))
      .reduce((sum, animations) => ({...sum, ...animations}), {}) // Animations
  )
}

export function unmarshalAnimation(
  file: Aseprite.File,
  frameTag: Aseprite.FrameTag
): Animation {
  const frames = []
  for (
    let frameNumber = frameTag.from;
    frameNumber <= frameTag.to;
    ++frameNumber
  ) {
    const tagFrameNumber = marshalTagFrameNumber(frameTag.name, frameNumber)
    const frame = unmarshalFrame(
      file,
      file.frames[tagFrameNumber],
      frameTag.name,
      frameNumber
    )
    frames.push(frame)
  }

  return {frames, direction: frameTag.direction}
}

export function marshalTagFrameNumber(
  tag: Aseprite.Tag,
  index?: number
): Aseprite.TagFrameNumber {
  return `${tag} ${index === undefined ? '' : index}`
}

export function unmarshalFrame(
  file: Aseprite.File,
  frame: Aseprite.Frame,
  tag: Aseprite.Tag,
  frameNumber: number
): Frame {
  return {
    texture: unmarshalTexture(frame),
    duration: unmarshalDuration(frame.duration),
    collision: unmarshalCollision(file.meta.slices, tag, frameNumber)
  }
}

export function unmarshalTexture(frame: Aseprite.Frame): Aseprite.Rect {
  const padding = unmarshalPadding(frame)
  return {
    x: frame.frame.x + padding.w / 2,
    y: frame.frame.y + padding.h / 2,
    w: frame.spriteSourceSize.w,
    h: frame.spriteSourceSize.h
  }
}

export function unmarshalPadding(frame: Aseprite.Frame): Aseprite.WH {
  return {
    w: frame.frame.w - frame.spriteSourceSize.w,
    h: frame.frame.h - frame.spriteSourceSize.h
  }
}

export function unmarshalDuration(duration: Aseprite.Duration): number {
  return duration === Aseprite.INFINITE_DURATION
    ? Number.POSITIVE_INFINITY
    : duration
}

export function unmarshalCollision(
  slices: Aseprite.Slice[],
  tag: Aseprite.Tag,
  frameNumber: number
): Aseprite.Rect[] {
  return slices
    .filter(slice => slice.name === tag) // Filter out Slices not for this Tag.
    .map(slice => slice.keys) // To Key[][].
    .reduce((sum, keys) => sum.concat(keys), []) // To Key[].
    .filter(key => key.frame === frameNumber) // Filter Keys not for this Frame.
    .map(key => key.bounds) // To Bounds.
}
