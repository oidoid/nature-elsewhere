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
  cels: Cel[]
  direction: Aseprite.Direction
}

export type Cel = {
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
    animations: unmarshalAnimations(
      file.meta.frameTags,
      file.frames,
      file.meta.slices
    )
  }
}

export function unmarshalAnimations(
  frameTags: Aseprite.FrameTag[],
  frames: Aseprite.Frames,
  slices: Aseprite.Slice[]
): Animations {
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
  frames: Aseprite.Frames,
  slices: Aseprite.Slice[]
): Animation {
  const cels = []
  for (
    let frameNumber = frameTag.from;
    frameNumber <= frameTag.to;
    ++frameNumber
  ) {
    const tagFrameNumber = marshalTagFrameNumber(frameTag.name, frameNumber)
    const cel = unmarshalCel(
      frameTag,
      frames[tagFrameNumber],
      frameNumber,
      slices
    )
    cels.push(cel)
  }

  return {cels, direction: frameTag.direction}
}

export function marshalTagFrameNumber(
  tag: Aseprite.Tag,
  index?: number
): Aseprite.TagFrameNumber {
  return `${tag} ${index === undefined ? '' : index}`
}

export function unmarshalCel(
  frameTag: Aseprite.FrameTag,
  frame: Aseprite.Frame,
  frameNumber: number,
  slices: Aseprite.Slice[]
): Cel {
  return {
    texture: unmarshalTexture(frame),
    duration: unmarshalDuration(frame.duration),
    collision: unmarshalCollision(frameTag, frameNumber, slices)
  }
}

export function unmarshalTexture(frame: Aseprite.Frame): Aseprite.Rect {
  const padding = unmarshalPadding(frame)
  return {
    x: frame.frame.x + padding.w / 2,
    y: frame.frame.y + padding.h / 2,
    w: frame.sourceSize.w,
    h: frame.sourceSize.h
  }
}

export function unmarshalPadding(frame: Aseprite.Frame): Aseprite.WH {
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
): Aseprite.Rect[] {
  const offset = frameNumber - frameTag.from
  return (
    slices
      // Filter out Slices not for this Tag.
      .filter(slice => slice.name === frameTag.name)
      // For each Slice, get the latest relevant Key.
      .map(slice => slice.keys.filter(key => key.frame <= offset).slice(-1))
      .reduce((sum, keys) => sum.concat(keys), []) // Key[]
      .map(key => key.bounds) // Bounds
  )
}
