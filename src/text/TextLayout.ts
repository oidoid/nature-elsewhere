import {Font} from './Font'
import * as memFont from './memFont.json'
import {XY} from '../math/XY'
import {Rect} from '../math/Rect'

export interface TextLayout {
  /** The length of this array matches the string length. */
  readonly chars: readonly Maybe<Rect>[]
  /** The offset in pixels. */
  readonly cursor: XY
}

const font: Font = Object.freeze(memFont)

export namespace TextLayout {
  /** @arg width The allowed layout width in pixels. */
  export function layout(string: string, width: number, scale: XY): TextLayout {
    const chars: Maybe<Rect>[] = []
    let cursor = new XY(0, 0)
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
      chars.push(...layout.chars)
      cursor.x = layout.cursor.x
      cursor.y = layout.cursor.y
      i += layout.chars.length
    }
    return {chars, cursor}
  }

  /** @arg {x,y} The cursor offset in pixels.
      @arg width The allowed layout width in pixels. */
  export function layoutWord(
    {x, y}: XY,
    width: number,
    string: string,
    index: number,
    scale: XY
  ): TextLayout {
    const chars = []
    while (index < string.length && !/\s/.test(string[index])) {
      const span = tracking(string[index], scale, string[index + 1])
      if (x && x + span > width) ({x, y} = nextLine(y, scale))
      // Width is not span since, with kerning, that may exceed the actual
      // width of the letter's image. For example, if w has the maximal letter
      // width of five pixels and a one pixel kerning for a given pair of
      // letters, it will have a span of six pixels which is greater than the
      // maximal five pixel image that can be rendered.
      const w = scale.x * Font.letterWidth(font, string[index])
      const h = scale.y * font.letterHeight
      chars.push(Rect.make(x, y, w, h))
      x += span
      ++index
    }
    return {chars, cursor: new XY(x, y)}
  }

  export function nextLine(y: number, scale: XY): XY {
    return new XY(0, y + scale.y * font.lineHeight)
  }
}

/** @arg cursor The cursor offset in pixels. */
function layoutNewline({y}: XY, scale: XY): TextLayout {
  return {
    chars: [undefined],
    cursor: TextLayout.nextLine(y, scale)
  }
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
): TextLayout {
  const cursor =
    x && x + span >= width ? TextLayout.nextLine(y, scale) : new XY(x + span, y)
  return {chars: [undefined], cursor}
}

/** @return The distance in pixels from the start of lhs to the start of rhs. */
function tracking(lhs: string, scale: XY, rhs?: string): number {
  return scale.x * (Font.letterWidth(font, lhs) + Font.kerning(font, lhs, rhs))
}
