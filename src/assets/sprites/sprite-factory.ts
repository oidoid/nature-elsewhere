import {TEXTURE} from '../textures/texture'
import {XY} from '../../geo'
import {Sprite} from './sprite'

export function newCloudS(position: XY): Sprite[] {
  return [
    {
      texture: TEXTURE.CLOUD_S,
      position,
      speed: {x: 0, y: 0},
      celIndex: 0,
      flip: {x: false, y: false}
    }
  ]
}

export function newCloudM(position: XY): Sprite[] {
  return [
    {
      texture: TEXTURE.CLOUD_M,
      position,
      speed: {x: 0, y: 0},
      celIndex: 0,
      flip: {x: false, y: false}
    }
  ]
}

export function newCloudL(position: XY): Sprite[] {
  return [
    {
      texture: TEXTURE.CLOUD_L,
      position,
      speed: {x: 0, y: 0},
      celIndex: 0,
      flip: {x: false, y: false}
    }
  ]
}

export function newCloudXL(position: XY): Sprite[] {
  return [
    {
      texture: TEXTURE.CLOUD_XL,
      position,
      speed: {x: 0, y: 0},
      celIndex: 0,
      flip: {x: false, y: false}
    }
  ]
}

export function newGrassL(position: XY): Sprite[] {
  return [
    {
      texture: TEXTURE.GRASS_L,
      position,
      speed: {x: 0, y: 0},
      celIndex: 0,
      flip: {x: false, y: false}
    }
  ]
}

export function newPlayer(position: XY): Sprite[] {
  return [
    {
      texture: TEXTURE.PLAYER_IDLE,
      position,
      speed: {x: 0, y: 0},
      celIndex: 0,
      flip: {x: false, y: false}
    }
  ]
}

export function newPond(position: XY, flowRate: number): Sprite[] {
  return [
    {
      texture: TEXTURE.POND_WATER,
      position,
      speed: {x: 0, y: 0},
      celIndex: 0,
      flip: {x: false, y: false}
    },
    {
      texture: TEXTURE.POND_REFLECTIONS,
      position,
      speed: {x: 0, y: 0},
      scroll: {x: flowRate, y: 0},
      scrollPosition: {x: 0, y: 0},
      celIndex: 0,
      flip: {x: false, y: false}
    },
    {
      texture: TEXTURE.POND_MASK,
      position,
      speed: {x: 0, y: 0},
      celIndex: 0,
      flip: {x: false, y: false}
    }
  ]
}

export function newRainCloudS(position: XY): Sprite[] {
  const speed = {x: -0.1, y: 0}
  return [
    {
      texture: TEXTURE.RAIN,
      position: {x: position.x + 1, y: position.y + 15},
      speed,
      celIndex: 0,
      flip: {x: false, y: false},
      scroll: {x: 0, y: -12},
      scrollPosition: {x: 0, y: 0}
    },
    {
      texture: TEXTURE.RAIN,
      position: {x: position.x + 1, y: position.y + 31},
      speed,
      celIndex: 0,
      flip: {x: false, y: false},
      scroll: {x: 0, y: -12},
      scrollPosition: {x: 0, y: 0}
    },
    {
      texture: TEXTURE.RAIN,
      position: {x: position.x + 1, y: position.y + 40},
      speed,
      celIndex: 0,
      flip: {x: false, y: false},
      scroll: {x: 0, y: -12},
      scrollPosition: {x: 0, y: 0}
    },
    {
      texture: TEXTURE.CLOUD_S,
      position,
      speed,
      celIndex: 0,
      flip: {x: false, y: false}
    }
  ]
}

export function newTree(position: XY): Sprite[] {
  return [
    {
      texture: TEXTURE.TREE,
      position,
      speed: {x: 0, y: 0},
      celIndex: 0,
      flip: {x: false, y: false}
    }
  ]
}
