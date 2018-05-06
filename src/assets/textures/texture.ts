export enum TextureURL {
  ATLAS = '/assets/textures/atlas.png'
}

export type TextureName = keyof typeof TEXTURE
export type Texture = typeof TEXTURE[TextureName]
export const TEXTURE = {
  CACTUS_S: {url: TextureURL.ATLAS, id: 'cactus s'},
  CACTUS_M: {url: TextureURL.ATLAS, id: 'cactus m'},
  CACTUS_L: {url: TextureURL.ATLAS, id: 'cactus l'},
  CACTUS_XL: {url: TextureURL.ATLAS, id: 'cactus xl'},
  CHAR_WALK: {url: TextureURL.ATLAS, id: 'char walk'},
  CHAR_XS: {url: TextureURL.ATLAS, id: 'cloud xs'},
  CLOUD_S: {url: TextureURL.ATLAS, id: 'cloud s'},
  CLOUD_M: {url: TextureURL.ATLAS, id: 'cloud m'},
  CLOUD_L: {url: TextureURL.ATLAS, id: 'cloud l'},
  CLOUD_XL: {url: TextureURL.ATLAS, id: 'cloud xl'},
  FLAG: {url: TextureURL.ATLAS, id: 'flag '},
  GRASS: {url: TextureURL.ATLAS, id: 'grass '},
  PALETTE_0: {url: TextureURL.ATLAS, id: 'palette 0'},
  PALETTE_1: {url: TextureURL.ATLAS, id: 'palette 1'},
  PALETTE_2: {url: TextureURL.ATLAS, id: 'palette 2'},
  PALETTE_3: {url: TextureURL.ATLAS, id: 'palette 3'},
  PALETTE_4: {url: TextureURL.ATLAS, id: 'palette 4'},
  PALETTE_5: {url: TextureURL.ATLAS, id: 'palette 5'},
  PALETTE_6: {url: TextureURL.ATLAS, id: 'palette 6'},
  PALETTE_7: {url: TextureURL.ATLAS, id: 'palette 7'},
  PALETTE_8: {url: TextureURL.ATLAS, id: 'palette 8'},
  PALETTE_9: {url: TextureURL.ATLAS, id: 'palette 9'},
  POND_MASK: {url: TextureURL.ATLAS, id: 'pond mask'},
  POND_WATER: {url: TextureURL.ATLAS, id: 'pond water'},
  POND_REFLECTIONS: {url: TextureURL.ATLAS, id: 'pond reflections'},
  RAIN: {url: TextureURL.ATLAS, id: 'rain '}
}

export function textureEquals(lhs: Texture, rhs: Texture): boolean {
  return lhs.url === rhs.url && lhs.id === rhs.id
}
