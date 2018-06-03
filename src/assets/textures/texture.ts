export enum AssetID {
  ATLAS
}

export const ASSET_URL = {
  [AssetID.ATLAS]: '/assets/textures/atlas.png'
}

export type Texture = typeof TEXTURE[keyof typeof TEXTURE]
export const TEXTURE = {
  BIRD_REST: {assetID: AssetID.ATLAS, id: 'bird rest'},
  BIRD_RISE: {assetID: AssetID.ATLAS, id: 'bird rise'},
  BIRD_FLY: {assetID: AssetID.ATLAS, id: 'bird fly'},
  BULL: {assetID: AssetID.ATLAS, id: 'bull '},
  CACTUS_S: {assetID: AssetID.ATLAS, id: 'cactus s'},
  CACTUS_M: {assetID: AssetID.ATLAS, id: 'cactus m'},
  CACTUS_L: {assetID: AssetID.ATLAS, id: 'cactus l'},
  CACTUS_XL: {assetID: AssetID.ATLAS, id: 'cactus xl'},
  CATTAILS: {assetID: AssetID.ATLAS, id: 'cattails '},
  CHAR_WALK: {assetID: AssetID.ATLAS, id: 'char walk'},
  CHAR_XS: {assetID: AssetID.ATLAS, id: 'cloud xs'},
  CLOUD_S: {assetID: AssetID.ATLAS, id: 'cloud s'},
  CLOUD_M: {assetID: AssetID.ATLAS, id: 'cloud m'},
  CLOUD_L: {assetID: AssetID.ATLAS, id: 'cloud l'},
  CLOUD_XL: {assetID: AssetID.ATLAS, id: 'cloud xl'},
  COPYRIGHT_RNDMEM: {
    assetID: AssetID.ATLAS,
    id: 'copyright-rndmem '
  },
  FLAG: {assetID: AssetID.ATLAS, id: 'flag '},
  GRASS_XS: {assetID: AssetID.ATLAS, id: 'grass xs'},
  GRASS_S: {assetID: AssetID.ATLAS, id: 'grass s'},
  GRASS_M: {assetID: AssetID.ATLAS, id: 'grass m'},
  GRASS_L: {assetID: AssetID.ATLAS, id: 'grass l'},
  NATURE_ELSEWHERE: {
    assetID: AssetID.ATLAS,
    id: 'nature-elsewhere '
  },
  PALETTE_0: {assetID: AssetID.ATLAS, id: 'palette 0'},
  PALETTE_1: {assetID: AssetID.ATLAS, id: 'palette 1'},
  PALETTE_2: {assetID: AssetID.ATLAS, id: 'palette 2'},
  PALETTE_3: {assetID: AssetID.ATLAS, id: 'palette 3'},
  PALETTE_4: {assetID: AssetID.ATLAS, id: 'palette 4'},
  PALETTE_5: {assetID: AssetID.ATLAS, id: 'palette 5'},
  PALETTE_6: {assetID: AssetID.ATLAS, id: 'palette 6'},
  PALETTE_7: {assetID: AssetID.ATLAS, id: 'palette 7'},
  PALETTE_8: {assetID: AssetID.ATLAS, id: 'palette 8'},
  PALETTE_9: {assetID: AssetID.ATLAS, id: 'palette 9'},
  POND_MASK: {assetID: AssetID.ATLAS, id: 'pond mask'},
  POND_WATER: {assetID: AssetID.ATLAS, id: 'pond water'},
  POND_REFLECTIONS: {
    assetID: AssetID.ATLAS,
    id: 'pond reflections'
  },
  PUMPKIN: {assetID: AssetID.ATLAS, id: 'pumpkin '},
  RAIN: {assetID: AssetID.ATLAS, id: 'rain '},
  SNAKE: {assetID: AssetID.ATLAS, id: 'snake '},
  TREE: {assetID: AssetID.ATLAS, id: 'tree '},
  WATER_S: {assetID: AssetID.ATLAS, id: 'water s'},
  WATER_M: {assetID: AssetID.ATLAS, id: 'water m'},
  WATER_L: {assetID: AssetID.ATLAS, id: 'water l'}
}

export function textureEquals(lhs: Texture, rhs: Texture): boolean {
  return lhs.assetID === rhs.assetID && lhs.id === rhs.id
}
