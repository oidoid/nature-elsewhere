import {Rect} from '../math/rect/rect'
import {WH} from '../math/wh/wh'
import {XY} from '../math/xy/xy'

export namespace Viewport {
  /** @return The maximum scale possible. */
  export const scale = (canvas: WH, minSize: WH, zoomOut: number): number => {
    const x = canvas.w / minSize.w
    const y = canvas.h / minSize.h
    return Math.max(1, Math.floor(Math.min(x, y)) - zoomOut)
  }

  export const canvasWH = (doc: Document): WH => {
    const {clientWidth, clientHeight} = doc.documentElement
    return {w: clientWidth, h: clientHeight}
  }

  export const camWH = ({w, h}: WH, scale: number): WH => ({
    w: Math.ceil(w / scale),
    h: Math.ceil(h / scale)
  })

  /** @arg {x, y} The viewport coordinates of the input in pixels, usually
                  {x: ev.clientX, y: ev.clientY}.
      @arg {w, h} The viewport dimensions in pixels (canvasWH).
      @arg cam The coordinates and dimensions of the camera the input was made
               through.
      @return The fractional position in level coordinates. */
  export const toLevelXY = ({x, y}: XY, {w, h}: WH, cam: Rect): XY => ({
    x: cam.x + (x / w) * cam.w,
    y: cam.y + (y / h) * cam.h
  })
}
