const maxDimen = 256
export const MIN = -0x8000
export const HALF_MIN = -0x4000
export const HALF_MAX = 0x4000
export const MAX = 0x7fff
export const SAFE_MIN = MIN / maxDimen
export const SAFE_MAX = MAX / maxDimen

export const HALF_MAX_XY = {x: HALF_MAX, y: HALF_MAX}
export const MAX_XY = {x: MAX, y: MAX}
export const SAFE_MAX_XY = {x: SAFE_MAX, y: SAFE_MAX}
