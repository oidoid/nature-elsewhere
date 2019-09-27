import {Aseprite} from './Aseprite'
import {Atlas} from './Atlas'
import {AtlasIDParser} from './AtlasIDParser'
import {XY} from '../math/XY'
import {WH} from '../math/WH'

export namespace AtlasParser {
  export function parse({meta, frames}: Aseprite.File): Atlas {
    return meta.frameTags.reduce(
      (sum: Atlas, frameTag) => ({
        ...sum,
        [AtlasIDParser.parse(frameTag.name)]: parseAnimation(frameTag, frames)
      }),
      <Atlas>{}
    )
  }

  export function parseAnimation(
    frameTag: Aseprite.FrameTag,
    frameMap: Aseprite.FrameMap
  ): Atlas.Animation {
    const frames = tagFrames(frameTag, frameMap)
    const cels = frames.map(parseCel)

    let duration = cels.reduce((ret, {duration}) => ret + duration, 0)
    const pingPong =
      frameTag.direction === Aseprite.AnimationDirection.PING_PONG
    if (pingPong && cels.length > 2)
      duration += duration - (cels[0].duration + cels[cels.length - 1].duration)

    const {w, h} = frames[0].sourceSize
    const direction = parseAnimationDirection(frameTag)
    return {size: new WH(w, h), cels, duration, direction}
  }

  function tagFrames(
    {name, from, to}: Aseprite.FrameTag,
    frameMap: Aseprite.FrameMap
  ): readonly Aseprite.Frame[] {
    const ret = []
    for (; from <= to; ++from) ret.push(frameMap[`${name} ${from}`])
    return ret
  }

  export function parseAnimationDirection({
    direction
  }: Aseprite.FrameTag): Atlas.AnimationDirection {
    if (isAnimationDirection(direction)) return direction
    throw new Error(`"${direction}" is not a Direction.`)
  }

  export function isAnimationDirection(
    direction: string
  ): direction is Atlas.AnimationDirection {
    const vals = Object.values(Atlas.AnimationDirection)
    return vals.includes(<Atlas.AnimationDirection>direction)
  }

  export function parseCel(frame: Aseprite.Frame): Atlas.Cel {
    const position = parsePosition(frame)
    return {position, duration: parseDuration(frame.duration)}
  }

  export function parsePosition(frame: Aseprite.Frame): XY {
    const padding = parsePadding(frame)
    return new XY(frame.frame.x + padding.w / 2, frame.frame.y + padding.h / 2)
  }

  export function parsePadding({frame, sourceSize}: Aseprite.Frame): WH {
    return new WH(frame.w - sourceSize.w, frame.h - sourceSize.h)
  }

  export function parseDuration(duration: Aseprite.Duration): number {
    return duration === Aseprite.INFINITE ? Number.POSITIVE_INFINITY : duration
  }
}
