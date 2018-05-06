export enum URL {
  ATLAS = '/assets/textures/atlas.png'
}

export type Texture = typeof TEXTURE[keyof typeof TEXTURE]
export const TEXTURE = {
  CACTUS_S: {url: URL.ATLAS, id: 'cactus s'},
  CACTUS_M: {url: URL.ATLAS, id: 'cactus m'},
  CACTUS_L: {url: URL.ATLAS, id: 'cactus l'},
  CACTUS_XL: {url: URL.ATLAS, id: 'cactus xl'},
  CHAR_WALK: {url: URL.ATLAS, id: 'char walk'},
  CHAR_XS: {url: URL.ATLAS, id: 'cloud xs'},
  CLOUD_S: {url: URL.ATLAS, id: 'cloud s'},
  CLOUD_M: {url: URL.ATLAS, id: 'cloud m'},
  CLOUD_L: {url: URL.ATLAS, id: 'cloud l'},
  CLOUD_XL: {url: URL.ATLAS, id: 'cloud xl'},
  FLAG: {url: URL.ATLAS, id: 'flag '},
  GRASS: {url: URL.ATLAS, id: 'grass '},
  PALETTE_0: {url: URL.ATLAS, id: 'palette 0'},
  PALETTE_1: {url: URL.ATLAS, id: 'palette 1'},
  PALETTE_2: {url: URL.ATLAS, id: 'palette 2'},
  PALETTE_3: {url: URL.ATLAS, id: 'palette 3'},
  PALETTE_4: {url: URL.ATLAS, id: 'palette 4'},
  PALETTE_5: {url: URL.ATLAS, id: 'palette 5'},
  PALETTE_6: {url: URL.ATLAS, id: 'palette 6'},
  PALETTE_7: {url: URL.ATLAS, id: 'palette 7'},
  PALETTE_8: {url: URL.ATLAS, id: 'palette 8'},
  PALETTE_9: {url: URL.ATLAS, id: 'palette 9'},
  POND_MASK: {url: URL.ATLAS, id: 'pond mask'},
  POND_WATER: {url: URL.ATLAS, id: 'pond water'},
  POND_REFLECTIONS: {url: URL.ATLAS, id: 'pond reflections'},
  RAIN: {url: URL.ATLAS, id: 'rain '}
}
