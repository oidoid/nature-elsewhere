import {Entity} from './entity'
import {XY} from '../math/xy'

export interface Backpacker extends Entity {
  readonly id: 'backpacker'
  dst?: XY
}

export namespace Backpacker {
  export const is = (val: Entity): val is Backpacker => val.id === 'backpacker'
}
