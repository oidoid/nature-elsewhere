import * as palette from './palette'
import * as SpriteFactory from '../sprites/sprite-factory'

export const PLAYER = SpriteFactory.newPlayer({x: 35, y: 60})[0]

export namespace Level0 {
  export const Map = {
    width: 1024,
    height: 128,
    backgroundColor: palette.base,
    sprites: SpriteFactory.newPond({x: 32, y: 64}, 1).concat(PLAYER)
  }
}
