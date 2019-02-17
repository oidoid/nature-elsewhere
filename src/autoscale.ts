/** @return The maximum scale possible. */
export function max(canvas: WH, minSize: WH): number {
  const x = canvas.w / minSize.w
  const y = canvas.h / minSize.h
  return Math.max(1, Math.floor(Math.min(x, y)))
}
