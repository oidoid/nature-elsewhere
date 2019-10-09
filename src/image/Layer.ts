/** The image draw order from bottom (lesser) to top (greater). Within a Layer,
    images are drawn in y-coordinate + height ascending order (lesser to
    greater). y-coordinate + height-ordering is the preferred resolution
    mechanism but the lowest possible Layer may be used where necessary. Layer
    is like a z-coordinate. */
export enum Layer {
  /** Terrain. */
  PLANE,
  GRID,
  ABOVE_PLANE,
  SHADOW,
  /** Anything flat that is painted on the plane and should appear above
      shadow. */
  DECAL,
  BLOOD,
  DEAD,

  /** Anything above the terrain and not flat. */
  DEFAULT,

  /** Anything elevated. */
  FLOATS,

  UI_LO,
  UI_MID,
  UI_HI,
  UI_HIHI,
  /** Special entity offset hack. */
  UI_PICKER_OFFSET,
  UI_CURSOR = 0xff
}
