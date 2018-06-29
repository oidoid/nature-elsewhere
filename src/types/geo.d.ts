/** A rectangular bounds with size and position. */
export type Rect = XY & WH

/** A size given by width and height lengths. */
export type WH = Readonly<{
  /** Width. */
  w: number
  /** Height. */
  h: number
}>

/** A position given in x and y-coordinates. */
export type XY = Readonly<{
  /** Distance along the x-axis. */
  x: number
  /** Distance along the y-axis. */
  y: number
}>
