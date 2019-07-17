import {XY} from '../math/xy'

declare global {
  type ImageSystem = Readonly<{origin: XY; images: readonly Image[]}>
}

export function moveTo(
  origin: XY,
  xy: XY,
  ...images: readonly Image[]
): ImageSystem {
  if (XY.equal(origin, xy)) return {origin, images}
  return moveBy(origin, XY.sub(xy, origin), ...images)
}

export function moveBy(
  origin: XY,
  {x, y}: XY,
  ...images: readonly Image[]
): ImageSystem {
  images.forEach(img => ((img.x += x), (img.y += y)))
  return {origin: XY.add(origin, {x, y}), images}
}

export function centerOn(
  bounds: Rect,
  rect: Rect,
  ...images: readonly Image[]
): ImageSystem {
  const x = Math.trunc(rect.x + rect.w / 2) - Math.trunc(bounds.w / 2)
  const y = Math.trunc(rect.y + rect.h / 2) - Math.trunc(bounds.h / 2)
  return moveTo(bounds, {x, y}, ...images)
}
