/** The entity draw order from bottom (lesser) to top (greater). Within a Layer,
 *  entities are drawn in Y-coordinate + height ascending order (lesser to
 *  greater). Y-coordinate + height-ordering is the preferred resolution
 *  mechanism but the lowest possible Layer may be used where necessary. */
export enum Layer {
  /** Terrain. */
  PLANE = 0x11,
  SHADOW = 0x12,
  /** Blood, groundcover, or anything flat that is painted on the plane. */
  DECAL = 0x14,

  /** Anything above the terrain and not flat. */
  DEFAULT = 0x21,

  /** Anything elevated. */
  FLOATS = 0x31,

  UI_LO = 0x41,
  UI_MID = 0x42,
  UI_HI = 0x44,
  UI_HIHI = 0x48
}
