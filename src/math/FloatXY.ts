import {NumberUtil} from './NumberUtil'

export interface FloatXY {
  x: number
  y: number
}

export namespace FloatXY {
  export function diagonal(component: number): FloatXY {
    return {x: component, y: component}
  }

  export function copy({x, y}: Readonly<FloatXY>): FloatXY {
    return {x, y}
  }

  export function equal(
    lhs: Readonly<FloatXY>,
    rhs: Readonly<FloatXY>
  ): boolean {
    return lhs.x === rhs.x && lhs.y === rhs.y
  }

  export function add(
    lhs: Readonly<FloatXY>,
    rhs: Readonly<FloatXY> | number
  ): FloatXY {
    rhs = toFloatXY(rhs)
    return {x: lhs.x + rhs.x, y: lhs.y + rhs.y}
  }

  export function sub(
    lhs: Readonly<FloatXY>,
    {x, y}: Readonly<FloatXY>
  ): FloatXY {
    return {x: lhs.x - x, y: lhs.y - y}
  }

  export function mul(lhs: Readonly<FloatXY>, rhs: Readonly<FloatXY>): FloatXY {
    return {x: lhs.x * rhs.x, y: lhs.y * rhs.y}
  }

  export function div(lhs: Readonly<FloatXY>, rhs: Readonly<FloatXY>): FloatXY {
    return {x: lhs.x / rhs.x, y: lhs.y / rhs.y}
  }

  export function abs({x, y}: Readonly<FloatXY>): FloatXY {
    return {x: Math.abs(x), y: Math.abs(y)}
  }

  export function min(lhs: Readonly<FloatXY>, rhs: Readonly<FloatXY>): FloatXY {
    return {x: Math.min(lhs.x, rhs.x), y: Math.min(lhs.y, rhs.y)}
  }

  export function max(lhs: Readonly<FloatXY>, rhs: Readonly<FloatXY>): FloatXY {
    return {x: Math.max(lhs.x, rhs.x), y: Math.max(lhs.y, rhs.y)}
  }

  export function magnitude({x, y}: Readonly<FloatXY>): number {
    return Math.sqrt(x * x + y * y)
  }

  export function clamp(
    val: Readonly<FloatXY>,
    min: Readonly<FloatXY>,
    max: Readonly<FloatXY>
  ): FloatXY {
    const x = NumberUtil.clamp(val.x, min.x, max.x)
    const y = NumberUtil.clamp(val.y, min.y, max.y)
    return {x, y}
  }

  export function lerp(
    from: Readonly<FloatXY>,
    to: Readonly<FloatXY>,
    ratio: number
  ): FloatXY {
    const x = from.x * (1 - ratio) + to.x * ratio
    const y = from.y * (1 - ratio) + to.y * ratio
    return {x, y}
  }
}

function toFloatXY(val: Readonly<FloatXY> | number): FloatXY {
  return typeof val === 'number' ? FloatXY.diagonal(val) : val
}
