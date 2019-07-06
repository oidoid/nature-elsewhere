export namespace Viewport {
  /** @return The maximum scale possible. */
  export function scale(canvas: WH, minSize: WH, zoomOut: number): number {
    const x = canvas.w / minSize.w
    const y = canvas.h / minSize.h
    return Math.max(1, Math.floor(Math.min(x, y)) - zoomOut)
  }

  export function canvasWH(doc: Document): WH {
    const {clientWidth, clientHeight} = doc.documentElement
    return {w: clientWidth, h: clientHeight}
  }

  export function cam({w, h}: WH, scale: number): Rect {
    return {x: 0, y: 0, w: Math.ceil(w / scale), h: Math.ceil(h / scale)}
  }

  /**
   * @arg {} {x, y} The viewport coordinates of the input in pixels, usually
   *                {x: event.clientX, y: event.clientY}.
   * @arg {} {w, h} The viewport dimensions in pixels.
   * @arg cam The coordinates and dimensions of the camera the input was made
   *          through.
   * @return The fractional position in the level's coordinate-system.
   */
  export function toLevelXY({x, y}: XY, {w, h}: WH, cam: Rect): XY {
    return {x: cam.x + (x / w) * cam.w, y: cam.y + (y / h) * cam.h}
  }
}
