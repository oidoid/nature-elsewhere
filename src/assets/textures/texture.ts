import {TextureAssetID} from '../asset-loader'

export const ASSET_URL = {
  [TextureAssetID.ATLAS]: '/assets/textures/atlas.png'
}

export type CloudTextureKey = 'CLOUD_S' | 'CLOUD_M' | 'CLOUD_L' | 'CLOUD_XL'
export const TALL_GRASS_TEXTURE_KEYS: TallGrassTextureKey[] = [
  'TALL_GRASS_A',
  'TALL_GRASS_B',
  'TALL_GRASS_C',
  'TALL_GRASS_D',
  'TALL_GRASS_E',
  'TALL_GRASS_F',
  'TALL_GRASS_G',
  'TALL_GRASS_H',
  'TALL_GRASS_I'
]
export type TallGrassTextureKey =
  | 'TALL_GRASS_A'
  | 'TALL_GRASS_B'
  | 'TALL_GRASS_C'
  | 'TALL_GRASS_D'
  | 'TALL_GRASS_E'
  | 'TALL_GRASS_F'
  | 'TALL_GRASS_G'
  | 'TALL_GRASS_H'
  | 'TALL_GRASS_I'

export type Texture = typeof TEXTURE[keyof typeof TEXTURE]
const atlas = {textureAssetID: TextureAssetID.ATLAS}
export const TEXTURE = {
  BEEHIVE: {...atlas, textureID: 'beehive'},
  BIRD_REST: {...atlas, textureID: 'bird rest'},
  BIRD_RISE: {...atlas, textureID: 'bird rise'},
  BIRD_FLY: {...atlas, textureID: 'bird fly'},
  BLOCK_S: {...atlas, textureID: 'block s'},
  BLOCK_M: {...atlas, textureID: 'block m'},
  BLOCK_L: {...atlas, textureID: 'block l'},
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
  PLAYER_SIT: {...atlas, textureID: 'player sit'},
  POND_MASK: {...atlas, textureID: 'pond mask'},
  POND_WATER: {...atlas, textureID: 'pond water'},
  POND_REFLECTIONS: {...atlas, textureID: 'pond reflections'},
  PUMPKIN: {...atlas, textureID: 'pumpkin '},
  QUICKSAND: {...atlas, textureID: 'quicksand '},
  RAIN: {...atlas, textureID: 'rain '},
  SNAKE: {...atlas, textureID: 'snake '},
  TALL_GRASS_A: {...atlas, textureID: 'tall-grass a'},
  TALL_GRASS_B: {...atlas, textureID: 'tall-grass b'},
  TALL_GRASS_C: {...atlas, textureID: 'tall-grass c'},
  TALL_GRASS_D: {...atlas, textureID: 'tall-grass d'},
  TALL_GRASS_E: {...atlas, textureID: 'tall-grass e'},
  TALL_GRASS_F: {...atlas, textureID: 'tall-grass f'},
  TALL_GRASS_G: {...atlas, textureID: 'tall-grass g'},
  TALL_GRASS_H: {...atlas, textureID: 'tall-grass h'},
  TALL_GRASS_I: {...atlas, textureID: 'tall-grass i'},
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
