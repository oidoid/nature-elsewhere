import {Aseprite} from './aseprite'
import {Atlas} from '../images/atlas'

export namespace AsepriteParser {
  export function parse(file: Aseprite.File): Atlas.Definition {
    return {
      size: file.meta.size,
      animations: parseAnimations(
        file.meta.frameTags,
        file.frames,
        file.meta.slices
      )
    }
  }

  export function parseAnimations(
    frameTags: ReadonlyArray<Aseprite.FrameTag>,
    frames: Aseprite.FrameMap,
    slices: ReadonlyArray<Aseprite.Slice>
  ): Atlas.AnimationMap {
    return <Atlas.AnimationMap>frameTags
      .map(frameTag => ({
        [frameTag.name]: parseAnimation(frameTag, frames, slices)
      }))
      .reduce((sum, animations) => ({...sum, ...animations}), {})
  }

  export function parseAnimation(
    frameTag: Aseprite.FrameTag,
    frames: Aseprite.FrameMap,
    slices: ReadonlyArray<Aseprite.Slice>
  ): Atlas.Animation {
    const cels = []
    let duration = 0
    let frame
    for (
      let frameNumber = frameTag.from;
      frameNumber <= frameTag.to;
      ++frameNumber
    ) {
      const tagFrameNumber = `${frameTag.name} ${frameNumber}`
      frame = frames[tagFrameNumber]
      const cel = parseCel(frameTag, frame, frameNumber, slices)
      duration += cel.duration
      cels.push(cel)
    }

    if (
      frameTag.direction === Aseprite.AnimationDirection.PING_PONG &&
      cels.length > 2
    ) {
      duration += duration - (cels[0].duration + cels[cels.length - 1].duration)
    }

    const size = frame ? frame.sourceSize : {w: 0, h: 0}
    return {
      size,
      cels,
      duration,
      direction: <Atlas.AnimationDirection>frameTag.direction
    }
  }

  export function parseCel(
    frameTag: Aseprite.FrameTag,
    frame: Aseprite.Frame,
    frameNumber: number,
    slices: ReadonlyArray<Aseprite.Slice>
  ): Atlas.Cel {
    return {
      position: parsePosition(frame),
      duration: parseDuration(frame.duration),
      collision: parseCollision(frameTag, frameNumber, slices)
    }
  }

  export function parsePosition(frame: Aseprite.Frame): XY {
    const padding = parsePadding(frame)
    return {
      x: frame.frame.x + padding.w / 2,
      y: frame.frame.y + padding.h / 2
    }
  }

  export function parsePadding(frame: Aseprite.Frame): WH {
    return {
      w: frame.frame.w - frame.sourceSize.w,
      h: frame.frame.h - frame.sourceSize.h
    }
  }

  export function parseDuration(duration: Aseprite.Duration): number {
    return duration === Aseprite.INFINITE_DURATION
      ? Number.POSITIVE_INFINITY
      : duration
  }

  export function parseCollision(
    frameTag: Aseprite.FrameTag,
    frameNumber: number,
    slices: ReadonlyArray<Aseprite.Slice>
  ): ReadonlyArray<Rect> {
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
}
