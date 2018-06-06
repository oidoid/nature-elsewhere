import * as palette from './palette'
import * as SpriteFactory from '../sprites/sprite-factory'

export namespace Level0 {
  export const Map = {
    width: 1024,
    height: 128,
    backgroundColor: palette.base,
    sprites: SpriteFactory.newPond({x: 32, y: 64}, 1).concat(
      SpriteFactory.newPlayer({x: 35, y: 60})
    )
  }
}
