import {WH, XY} from '../types/geo'
import {GLUniformLocation, GL} from './gl'

// The rendered width and height of the camera within the canvas.
const camResolution: WH = {w: 256, h: 192}

// canvas the desired resolution of the surface to render to.
export function resize(
  gl: GL,
  camLocation: GLUniformLocation | null,
  canvas: WH,
  position: XY
): void {
  gl.canvas.width = canvas.w
  gl.canvas.height = canvas.h

  // Calculate the minimum integer multiple needed for the viewport to fill or
  // exceed the canvas in both directions, Excess is cropped from the
  // lower-right corner.
  const scale = Math.ceil(
    Math.max(canvas.w / camResolution.w, canvas.h / camResolution.h)
  )
  const cam = cameraPosition(canvas, scale, position)

  gl.uniform4i(camLocation, cam.x, cam.y, camResolution.w, camResolution.h)

  gl.viewport(0, 0, scale * camResolution.w, scale * camResolution.h)
}

// in pixells
export function cameraPosition(canvas: WH, scale: number, position: XY): XY {
  // The camera position is a function of the player position and the canvas'
  // dimensions.
  //
  // The player's pixel position is rendered by implicitly truncating its model
  // position. Similarly, it is necessary to truncate the model position prior
  // to camera input to avoid rounding errors that cause the camera to lose
  // synchronicity with the rendered location and create jitter.
  //
  // For example, the model position may be 0.1 and the camera at an offset from
  // the player of 100.9. The rendered player position is thus truncated to 0.
  // Consider the possible camera positions:
  //
  //   Formula                   Result  Player pixel  Camera pixel  Distance  Notes
  //   0.1 + 100.9             =  101.0             0           101       101  No truncation.
  //   Math.trunc(0.1) + 100.9 =  100.9             0           100       100  Truncate before input.
  //   Math.trunc(0.1 + 100.9) =  101.0             0           101       101  Truncate after input.
  //
  // Now again when the model position has increased to 1.0 and the rendered
  // position is also 1, one pixel forward. The distance should be constant.
  //
  //   1.0 + 100.9             =  101.9             1           101       100  No truncation.
  //   Math.trunc(1.0) + 100.9 =  101.9             1           101       100  Truncate before input.
  //   Math.trunc(1.0 + 100.9) =  101.0             1           101       100  Truncate after input.
  //
  // As shown above, when truncation is not performed or it occurs afterwards on
  // the sum, rounding errors can cause the rendered distance between the center
  // of the camera and the player to vary under different inputs instead of
  // remaining a constant offset.
  //
  // The canvas offsets should be truncated by the call the GL.uniform4i() but
  // these appear to use the ceiling instead so another distinct and independent
  // call to Math.trunc() is made.
  return {
    // Center the camera on the player within the canvas bounds.
    x: Math.trunc(-position.x) + Math.trunc(canvas.w / (scale * 2)),
    y: Math.trunc(-position.y) + Math.trunc((7 * camResolution.h) / 8)
  }
}
