type XY = Readonly<{x: number; y: number}>
type WH = Readonly<{w: number; h: number}>

/**
 * Where XY describes the upper-left corner, or minimum, and XY + WH the
 * bottom-right, or maximum.
 */
type Rect = XY & WH
