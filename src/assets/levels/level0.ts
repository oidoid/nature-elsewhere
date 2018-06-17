import * as palette from './palette'
import * as SpriteFactory from '../sprites/sprite-factory'

export const PLAYER = SpriteFactory.newPlayer({x: 35, y: 60})[0]
export const GRASS_L = SpriteFactory.newGrassL({x: 16, y: 60})
  .concat(SpriteFactory.newGrassL({x: 160, y: 60}))
  .concat(SpriteFactory.newGrassL({x: 176, y: 60}))
export const TREE = SpriteFactory.newTree({x: 185, y: 44})

export namespace Level0 {
  export const Map = {
    width: 1024,
    height: 128,
    backgroundColor: palette.base,
    sprites: SpriteFactory.newPond({x: 32, y: 64}, 1)
      .concat(PLAYER)
      .concat(GRASS_L)
      .concat(TREE)
  }
}