import {TextureAssetID} from '../asset-loader'

export const ASSET_URL = {
  [TextureAssetID.ATLAS]: '/assets/textures/atlas.png'
}

export type Texture = typeof TEXTURE[keyof typeof TEXTURE]
const atlas = {textureAssetID: TextureAssetID.ATLAS}
export const TEXTURE = {
  BIRD_REST: {...atlas, textureID: 'bird rest'},
  BIRD_RISE: {...atlas, textureID: 'bird rise'},
  BIRD_FLY: {...atlas, textureID: 'bird fly'},
  BULL: {...atlas, textureID: 'bull '},
  CACTUS_S: {...atlas, textureID: 'cactus s'},
  CACTUS_M: {...atlas, textureID: 'cactus m'},
  CACTUS_L: {...atlas, textureID: 'cactus l'},
  CACTUS_XL: {...atlas, textureID: 'cactus xl'},
  CATTAILS: {...atlas, textureID: 'cattails '},
  CHAR_WALK: {...atlas, textureID: 'char walk'},
  CHAR_XS: {...atlas, textureID: 'cloud xs'},
  CLOUD_S: {...atlas, textureID: 'cloud s'},
  CLOUD_M: {...atlas, textureID: 'cloud m'},
  CLOUD_L: {...atlas, textureID: 'cloud l'},
  CLOUD_XL: {...atlas, textureID: 'cloud xl'},
  COPYRIGHT_RNDMEM: {...atlas, textureID: 'copyright-rndmem '},
  FLAG: {...atlas, textureID: 'flag '},
  GRASS_XS: {...atlas, textureID: 'grass xs'},
  GRASS_S: {...atlas, textureID: 'grass s'},
  GRASS_M: {...atlas, textureID: 'grass m'},
  GRASS_L: {...atlas, textureID: 'grass l'},
  NATURE_ELSEWHERE: {...atlas, textureID: 'nature-elsewhere '},
  PALETTE_0: {...atlas, textureID: 'palette 0'},
  PALETTE_1: {...atlas, textureID: 'palette 1'},
  PALETTE_2: {...atlas, textureID: 'palette 2'},
  PALETTE_3: {...atlas, textureID: 'palette 3'},
  PALETTE_4: {...atlas, textureID: 'palette 4'},
  PALETTE_5: {...atlas, textureID: 'palette 5'},
  PALETTE_6: {...atlas, textureID: 'palette 6'},
  PALETTE_7: {...atlas, textureID: 'palette 7'},
  PALETTE_8: {...atlas, textureID: 'palette 8'},
  PALETTE_9: {...atlas, textureID: 'palette 9'},
  PLAYER_IDLE: {...atlas, textureID: 'player idle'},
  PLAYER_IDLE_ARMED: {...atlas, textureID: 'player idle-armed'},
  PLAYER_CROUCH: {...atlas, textureID: 'player crouch'},
  PLAYER_CROUCH_ARMED: {...atlas, textureID: 'player crouch-armed'},
  PLAYER_WALK: {...atlas, textureID: 'player walk'},
  PLAYER_WALK_ARMED: {...atlas, textureID: 'player walk-armed'},
  PLAYER_RUN: {...atlas, textureID: 'player run'},
  PLAYER_RUN_ARMED: {...atlas, textureID: 'player run-armed'},
  PLAYER_ASCEND: {...atlas, textureID: 'player ascend'},
  PLAYER_ASCEND_ARMED: {...atlas, textureID: 'player ascend-armed'},
  PLAYER_DESCEND: {...atlas, textureID: 'player descend'},
  PLAYER_DESCEND_ARMED: {...atlas, textureID: 'player descend-armed'},
  POND_MASK: {...atlas, textureID: 'pond mask'},
  POND_WATER: {...atlas, textureID: 'pond water'},
  POND_REFLECTIONS: {...atlas, textureID: 'pond reflections'},
  PUMPKIN: {...atlas, textureID: 'pumpkin '},
  RAIN: {...atlas, textureID: 'rain '},
  SNAKE: {...atlas, textureID: 'snake '},
  TREE: {...atlas, textureID: 'tree '},
  WATER_S: {...atlas, textureID: 'water s'},
  WATER_M: {...atlas, textureID: 'water m'},
  WATER_L: {...atlas, textureID: 'water l'}
}

export function textureEquals(lhs: Texture, rhs: Texture): boolean {
  return (
    lhs.textureAssetID === rhs.textureAssetID && lhs.textureID === rhs.textureID
  )
}
