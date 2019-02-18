/** @return The maximum scale possible. */
export function scale(canvas: WH, minSize: WH): number {
  const x = canvas.w / minSize.w
  const y = canvas.h / minSize.h
  return Math.max(1, Math.floor(Math.min(x, y)))
}

export function canvas(window: Window): WH {
  const {clientWidth, clientHeight} = window.document.documentElement
  return {w: clientWidth, h: clientHeight}
}

export function cam({w, h}: WH, scale: number): Rect {
  return {x: 0, y: 0, w: Math.ceil(w / scale), h: Math.ceil(h / scale)}
}

// canvasSize(this._window),
// cam(this._window, this.scale),

//   const xy = clientToWorld({x: event.clientX, y: event.clientY}, canvas, cam)

// function clientToWorld({x, y}: XY, canvas: WH, cam: Rect): XY {
//   return {x: cam.x + (x / canvas.w) * cam.w, y: cam.y + (y / canvas.h) * cam.h}
// }

// The camera's position is a function of the player position and the
// canvas' dimensions.
//
// The pixel position is rendered by implicitly truncating the model
// position. Similarly, it is necessary to truncate the model position prior
// to camera input to avoid rounding errors that cause the camera to lose
// synchronicity with the rendered position and create jitter when the
// position updates.
//
// For example, the model position may be 0.1 and the camera at an offset
// from the position of 100.9. The rendered position is thus truncated to 0.
// Consider the possible camera positions:
//
//   Formula                   Result  Pixel position  Camera pixel  Distance  Notes
//   0.1 + 100.9             =  101.0               0           101       101  No truncation.
//   Math.trunc(0.1) + 100.9 =  100.9               0           100       100  Truncate before input.
//   Math.trunc(0.1 + 100.9) =  101.0               0           101       101  Truncate after input.
//
// Now again when the model position has increased to 1.0 and the rendered
// position is also 1, one pixel forward. The distance should be constant.
//
//   1.0 + 100.9             =  101.9               1           101       100  No truncation.
//   Math.trunc(1.0) + 100.9 =  101.9               1           101       100  Truncate before input.
//   Math.trunc(1.0 + 100.9) =  101.0               1           101       100  Truncate after input.
//
// As shown above, when truncation is not performed or it occurs afterwards
// on the sum, rounding errors can cause the rendered distance between the
// center of the camera and the position to vary under different inputs
// instead of remaining at a constant offset.
