import {AnimationID} from '../images/animation-id'
import * as Atlas from '../atlas/atlas'
import {EntityType} from './entity-type'
import * as Image from '../images/image'
import * as Text from '../text/text'

/** Bounds (x, y, w, and h members) are the union of all Entity images. This is
    used for quick collision detections such checking if the Entity is on
    screen. */
export interface State extends Mutable<Rect> {
  readonly type: keyof typeof EntityType
  /** Random number initial value or variant. */
  readonly seed: number
  velocity: Mutable<XY>
  acceleration: Mutable<XY>
  images: Image.State[]
}
export interface Config extends Partial<XY> {
  readonly type: keyof typeof EntityType
  readonly seed?: number
  readonly velocity?: Partial<XY>
  readonly acceleration?: Partial<XY>
}

export function make(
  atlas: Atlas.State,
  {
    type,
    seed = 0,
    x = 0,
    y = 0,
    velocity = {x: 0, y: 0},
    acceleration = {x: 0, y: 0}
  }: Config
): State {
  const images =
    (<Partial<Record<keyof typeof EntityType, Image.State[]>>>{
      BACKGROUND: newBackground({x, y}),
      TEXT_DATE_VERSION_HASH: newTextDateVersionHash({x, y})
    })[type] || []
  return {
    type,
    seed,
    ...Image.target(atlas, ...images),
    velocity: {x: velocity.x || 0, y: velocity.y || 0},
    acceleration: {x: acceleration.x || 0, y: acceleration.y || 0},
    images
  }
}

export function animate(
  entity: State,
  atlas: Atlas.State,
  time: number
): Readonly<Image.State>[] {
  entity.images.forEach(img => Image.animate(img, atlas, time))
  return entity.images
}

function newBackground({x, y}: XY): Readonly<Image.State>[] {
  return [Image.make(AnimationID.BACKGROUND, {x, y, layer: 'PLANE'})]
}

function newTextDateVersionHash(xy: XY): readonly Readonly<Image.State>[] {
  const {date, version, hash} = process.env
  return Text.toImages(`${date} v${version} (${hash})`, xy)
}
