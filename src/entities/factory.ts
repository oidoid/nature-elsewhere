import * as animation from './animation'
import * as entity from './entity'
import * as util from '../util'

export function newCloud(
  animationID: animation.ID,
  position: XY
): entity.State[] {
  return [
    {
      ...entity.newState(),
      type: entity.Type.CLOUD,
      position,
      animationID,
      drawOrder: entity.DrawOrder.CLOUDS
    }
  ]
}

export function newBackground(position: XY, scale: XY): entity.State[] {
  const animationID = animation.ID.PALETTE_PALE
  const drawOrder = entity.DrawOrder.BACKGROUND
  return [
    {
      ...entity.newState(),
      type: entity.Type.BACKGROUND,
      position,
      scale,
      animationID,
      drawOrder
    }
  ]
}

export function newPlayer(position: XY): entity.State[] {
  const animationID = animation.ID.PLAYER_IDLE
  const drawOrder = entity.DrawOrder.PLAYER
  return [
    {
      ...entity.newState(),
      type: entity.Type.PLAYER,
      position,
      animationID,
      drawOrder
    }
  ]
}

export function newRainCloud(
  animationID: animation.ID,
  {x, y}: XY,
  speed: number
): entity.State[] {
  const entities: entity.State[] = []
  const drawOrder = entity.DrawOrder.CLOUDS
  util.range(0, (-27 - y) / 16).forEach(i =>
    entities.push({
      ...entity.newState(),
      type: entity.Type.CLOUD,
      position: {
        // Round now to prevent rain from being an extra pixel off due to
        // truncation later.
        x: x + Math.round((i + 1) / 2),
        y: y + 6 + i * 16 - Math.max(0, y + 6 + i * 16 - -12)
      },
      animationID: animation.ID.RAIN,
      drawOrder,
      speed: {x: speed, y: 0},
      scrollSpeed: {x: 0, y: -0.012}
    })
  )
  entities.push({
    ...entity.newState(),
    type: entity.Type.CLOUD,
    position: {x: x + 1, y: -12},
    animationID: animation.ID.WATER_M,
    drawOrder,
    speed: {x: speed, y: 0}
  })
  entities.push({
    ...entity.newState(),
    type: entity.Type.CLOUD,
    position: {x, y},
    animationID,
    drawOrder,
    speed: {x: speed, y: 0}
  })
  return entities
}

export function newGrass(
  animationID: animation.ID,
  position: XY,
  scale: XY = {x: 1, y: 1}
): entity.State[] {
  const drawOrder =
    animationID >= animation.ID.GRASS_XS && animationID <= animation.ID.GRASS_L
      ? entity.DrawOrder.FAR_BACKGROUND_SCENERY
      : entity.DrawOrder.FOREGROUND_SCENERY
  return [
    {
      ...entity.newState(),
      type: entity.Type.GRASS,
      position,
      scale,
      animationID,
      drawOrder
    }
  ]
}

export function newHill(position: XY): entity.State[] {
  return [
    {
      ...entity.newState(),
      type: entity.Type.GRASS,
      position,
      animationID: animation.ID.HILL,
      drawOrder: entity.DrawOrder.FAR_BACKGROUND_SCENERY
    }
  ]
}

export function newTree(position: XY): entity.State[] {
  const animationID = animation.ID.TREE
  const drawOrder = entity.DrawOrder.NEAR_BACKGROUND_SCENERY
  return [
    {
      ...entity.newState(),
      type: entity.Type.TREE,
      position,
      animationID,
      drawOrder
    }
  ]
}

export function newSuperBall(position: XY, speed: XY): entity.State[] {
  const animationID = animation.ID.PALETTE_GOLD
  return [
    {
      ...entity.newState(),
      speed,
      type: entity.Type.SUPER_BALL,
      position,
      animationID,
      drawOrder: entity.DrawOrder.SUPER_BALL
    }
  ]
}
