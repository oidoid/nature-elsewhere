import {WH, XY, Rect} from '../types/geo'
import {GLUniformLocation, GL} from './gl'

/**
 * @param gl
 * @param camLocation
 * @param canvas The desired resolution of the canvas in CSS pixels. E.g.,
 *               {w: window.innerWidth, h: window.innerHeight}.
 * @param scale Positive integer zoom.
 * @param position The position to center on in physical pixels.
 */
export function resize(
  gl: GL,
  camLocation: GLUniformLocation | null,
  canvas: WH,
  scale: number,
  position: XY
): void {
  gl.canvas.width = canvas.w
  gl.canvas.height = canvas.h

  const cam = camera(canvas, scale, position)

  gl.uniform4i(camLocation, cam.x, cam.y, cam.w, cam.h)

  // The viewport is a rendered in physical pixels. It's intentional to use the
  // camera dimensions instead of canvas dimensions since the camera often
  // exceeds the canvas and the viewport's dimensions must be an integer
  // multiple of the camera.
  gl.viewport(0, 0, scale * cam.w, scale * cam.h)
}

/** @return Rectangle in physical pixels. */
function camera(canvas: WH, scale: number, position: XY): Rect {
  // The camera position is a function of the position and the canvas'
  // dimensions.
  //
  // The pixel position is rendered by implicitly truncating the model position.
  // Similarly, it is necessary to truncate the model position prior to camera
  // input to avoid rounding errors that cause the camera to lose synchronicity
  // with the rendered position and create jitter when the position updates.
  //
  // For example, the model position may be 0.1 and the camera at an offset from
  // the position of 100.9. The rendered position is thus truncated to 0.
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
  // As shown above, when truncation is not performed or it occurs afterwards on
  // the sum, rounding errors can cause the rendered distance between the center
  // of the camera and the position to vary under different inputs instead of
  // remaining at a constant offset.
  //
  // The canvas offsets should be truncated by the call the GL.uniform4i() but
  // these appear to use the ceiling instead so another distinct and independent
  // call to Math.trunc() is made.

  return {
    // Center the camera on the position within the canvas bounds.
    x: Math.trunc(-position.x) + Math.trunc(canvas.w / (scale * 2)),
    y: Math.trunc(-position.y) + Math.trunc((7 * canvas.h) / (scale * 8)),
    // The unscaled rendered width and height of the camera within the canvas.
    // Calculate the minimum integer dimensions needed for the rendered area to
    // fill or exceed the canvas in both directions. Excess is cropped from the
    // lower-right corner.
    w: Math.ceil(canvas.w / scale),
    h: Math.ceil(canvas.h / scale)
  }
}
