import {AnimationID} from '../images/animation-id'
import {Atlas} from '../images/atlas'
import {Image} from '../images/image'
import {MemFont} from './mem-font'
import {Palette} from '../images/palette'

export namespace Text {
  export interface Layout {
    /** The length of this array matches the string length. */
    readonly positions: ReadonlyArray<XY | undefined>
    /** The offset in pixels. */
    readonly cursor: XY
  }

  /**
   * @arg y The vertical scroll offset in pixels.
   * @arg target The window size in pixels.
   */
  export function toImages(
    atlas: Atlas.Definition,
    string: string,
    y: number = 0,
    {w, h}: WH = {w: Number.POSITIVE_INFINITY, h: Number.POSITIVE_INFINITY}
  ): ReadonlyArray<Image> {
    const images = []
    const positions = layout(string, w).positions
    for (let i = 0; i < positions.length; ++i) {
      const position = positions[i]
      if (!position) continue
      if (position.y + MemFont.lineHeight + MemFont.leading < y) continue
      if (position.y > y + h) break

      const id = 'MEM_FONT_' + string.charCodeAt(i)
      const d = Image.new(
        atlas,
        AnimationID[<keyof typeof AnimationID>id],
        Palette.GREYS,
        {layer: 10, position: {x: position.x, y: position.y - y}}
      )
      images.push(d)
    }
    return images
  }

  /** @arg width The allowed layout width in pixels. */
  export function layout(string: string, width: number): Layout {
    const positions: (XY | undefined)[] = []
    const cursor = {x: 0, y: 0}
    for (let i = 0; i < string.length; ) {
      let layout
      if (string[i] === '\n') {
        layout = layoutNewline(cursor)
      } else if (/\s/.test(string[i])) {
        layout = layoutSpace(cursor, width, tracking(string[i], string[i + 1]))
      } else {
        layout = layoutWord(cursor, width, string, i)
        if (
          cursor.x &&
          layout.cursor.y - cursor.y === MemFont.lineHeight + MemFont.leading
        ) {
          const wordWidth = width - cursor.x + layout.cursor.x
          if (wordWidth <= width) {
            // Word can fit on one line if cursor is reset to the start of the
            // line.
            cursor.x = 0
            cursor.y += MemFont.lineHeight + MemFont.leading
            layout = layoutWord(cursor, width, string, i)
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

  /**
   * @arg cursor The current offset in pixels.
   * @arg width The allowed layout width in pixels.
   */
  export function layoutWord(
    {x, y}: XY,
    width: number,
    string: string,
    index: number
  ): Layout {
    const positions = []
    while (index < string.length && !/\s/.test(string[index])) {
      const span = tracking(string[index], string[index + 1])
      if (x && x + span > width) {
        x = 0
        y += MemFont.lineHeight + MemFont.leading
      }
      positions.push({x, y: y + MemFont.letterOffset(string[index])})
      x += span
      ++index
    }
    return {positions, cursor: {x, y}}
  }

  /** @arg cursor The current offset in pixels. */
  function layoutNewline({y}: XY): Layout {
    return {
      positions: [undefined],
      cursor: {x: 0, y: y + MemFont.lineHeight + MemFont.leading}
    }
  }

  /**
   * @arg cursor The current offset in pixels.
   * @arg width The allowed layout width in pixels.
   * @arg span The distance in pixels from the start of the current letter to the
   *           start of the next.
   */
  function layoutSpace({x, y}: XY, width: number, span: number): Layout {
    return {
      positions: [undefined],
      cursor:
        x && x + span >= width
          ? {x: 0, y: y + MemFont.lineHeight + MemFont.leading}
          : {x: x + span, y}
    }
  }

  /** @return The distance in pixels from the start of lhs to the start of rhs. */
  function tracking(lhs: string, rhs?: string): number {
    return MemFont.letterWidth(lhs) + MemFont.kerning(lhs, rhs)
  }
}
