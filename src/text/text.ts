import {AnimationID} from '../images/animation-id'
import {Font} from './font'
import {Image} from '../images/image'
import * as memFont from '../assets/mem-font.json'
import {WH} from '../math/wh'
import {XY} from '../math/xy'

const font: Font = Object.freeze(memFont)

export namespace Text {
  export interface Layout {
    /** The length of this array matches the string length. */
    readonly positions: readonly (XY | undefined)[]
    /** The offset in pixels. */
    readonly cursor: XY
  }

  /** @arg y The vertical scroll offset in pixels.
    @arg target The window size in pixels. */
  export function toImages(
    string: string,
    cfg: Image.Config = {},
    y: number = 0,
    {w, h}: WH = {w: Number.POSITIVE_INFINITY, h: Number.POSITIVE_INFINITY}
  ): readonly Image[] {
    const images = []
    const scale = {x: 1, y: 1}
    const positions = layout(string, w, scale).positions
    for (let i = 0; i < positions.length; ++i) {
      const position = positions[i]
      if (!position) continue
      if (nextLine(position.y, scale).y < y) continue
      if (position.y > y + h) break

      const key = <keyof typeof AnimationID>('MEM_FONT_' + string.charCodeAt(i))
      const image = Image.make(key, {
        layer: 'UI_HIHI',
        ...cfg,
        x: (cfg.x || 0) + position.x,
        y: (cfg.y || 0) + position.y - y
      })
      images.push(image)
    }
    return images
  }

  /** @arg width The allowed layout width in pixels. */
  export function layout(string: string, width: number, scale: XY): Layout {
    const positions: (XY | undefined)[] = []
    let cursor = {x: 0, y: 0}
    for (let i = 0; i < string.length; ) {
      let layout
      if (string[i] === '\n') layout = layoutNewline(cursor, scale)
      else if (/\s/.test(string[i])) {
        layout = layoutSpace(
          cursor,
          width,
          tracking(string[i], scale, string[i + 1]),
          scale
        )
      } else {
        layout = layoutWord(cursor, width, string, i, scale)
        if (cursor.x && layout.cursor.y === nextLine(cursor.y, scale).y) {
          const wordWidth = width - cursor.x + layout.cursor.x
          if (wordWidth <= width) {
            // Word can fit on one line if cursor is reset to the start of the
            // line.
            cursor = nextLine(cursor.y, scale)
            layout = layoutWord(cursor, width, string, i, scale)
          }
        }
      }
      positions.push(...layout.positions)
      cursor.x = layout.cursor.x
      cursor.y = layout.cursor.y
      i += layout.positions.length
    }
    return {positions, cursor}
  }

  /** @arg {x,y} The cursor offset in pixels.
    @arg width The allowed layout width in pixels. */
  export function layoutWord(
    {x, y}: XY,
    width: number,
    string: string,
    index: number,
    scale: XY
  ): Layout {
    const positions = []
    while (index < string.length && !/\s/.test(string[index])) {
      const span = tracking(string[index], scale, string[index + 1])
      if (x && x + span > width) ({x, y} = nextLine(y, scale))
      positions.push({
        x,
        y: y + scale.y * Font.letterOffset(font, string[index])
      })
      x += span
      ++index
    }
    return {positions, cursor: {x, y}}
  }
}

/** @arg cursor The cursor offset in pixels. */
function layoutNewline({y}: XY, scale: XY): Text.Layout {
  return {positions: [undefined], cursor: nextLine(y, scale)}
}

/** @arg {x,y} The cursor offset in pixels.
    @arg width The allowed layout width in pixels.
    @arg span The distance in pixels from the start of the current letter to the
              start of the next including scale. */
function layoutSpace(
  {x, y}: XY,
  width: number,
  span: number,
  scale: XY
): Text.Layout {
  const cursor = x && x + span >= width ? nextLine(y, scale) : {x: x + span, y}
  return {positions: [undefined], cursor}
}

/** @return The distance in pixels from the start of lhs to the start of rhs. */
function tracking(lhs: string, scale: XY, rhs?: string): number {
  return scale.x * (Font.letterWidth(font, lhs) + Font.kerning(font, lhs, rhs))
}

function nextLine(y: number, scale: XY): XY {
  return {x: 0, y: y + scale.y * font.lineHeight}
}
