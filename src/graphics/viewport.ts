export namespace Viewport {
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
}
