/** A rectangular bounds with size and position. */
export type Rect = XY & WH

/** A size given by width and height lengths. */
export type WH = {
  /** Width. */
  readonly w: number
  /** Height. */
  readonly h: number
}

/** A position given in x and y-coordinates. */
export type XY = {
  /** Distance along the x-axis. */
  readonly x: number
  /** Distance along the y-axis. */
  readonly y: number
}
