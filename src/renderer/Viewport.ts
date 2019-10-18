import {FloatXY} from '../math/FloatXY'
import {ReadonlyRect} from '../math/Rect'
import {WH} from '../math/WH'
import {XY} from '../math/XY'

export namespace Viewport {
  /** @return The maximum scale possible. */
  export function scale(canvas: WH, minSize: WH, zoomOut: number): number {
    const x = canvas.w / minSize.w
    const y = canvas.h / minSize.h
    return Math.max(1, Math.floor(Math.min(x, y)) - zoomOut)
  }

  export function canvasWH(doc: Document): WH {
    const {clientWidth, clientHeight} = doc.documentElement
    return new WH(clientWidth, clientHeight)
  }

  export function camWH({w, h}: WH, scale: number): WH {
    return new WH(Math.ceil(w / scale), Math.ceil(h / scale))
  }

  /** @arg {x, y} The viewport coordinates of the input in window pixels,
                  usually new XY(event.clientX, event.clientY).
      @arg {w, h} The viewport dimensions in window pixels (canvasWH).
      @arg cam The coordinates and dimensions of the camera the input was made
               through in level pixels.
      @return The fractional position in level coordinates. */
  export function toLevelXY(
    {x, y}: FloatXY | XY,
    {w, h}: WH,
    cam: ReadonlyRect
  ): XY {
    return new XY(
      cam.position.x + Math.trunc((x / w) * cam.size.w),
      cam.position.y + Math.trunc((y / h) * cam.size.h)
    )
  }
}
