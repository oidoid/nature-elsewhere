/** The image draw order from bottom (lesser) to top (greater). Within a Layer,
 *  images are drawn in y-coordinate + height ascending order (lesser to
 *  greater). y-coordinate + height-ordering is the preferred resolution
 *  mechanism but the lowest possible Layer may be used where necessary. Layer
 *  is like a z-coordinate. */
export enum Layer {
  /** Terrain. */
  PLANE = 0x10,
  WATER = 0x11,
  SHADOW = 0x12,
  /** Groundcover or anything flat that is painted on the plane. */
  DECAL = 0x13,
  BLOOD = 0x14,
  DEAD = 0x15,

  /** Anything above the terrain and not flat. */
  DEFAULT = 0x20,

  /** Anything elevated. */
  FLOATS = 0x30,

  UI_LO = 0x40,
  UI_MID = 0x41,
  UI_HI = 0x42,
  UI_HIHI = 0x43,
  UI_CURSOR = 0x44
}

export namespace Layer {
  export type Key = keyof typeof Layer
}
