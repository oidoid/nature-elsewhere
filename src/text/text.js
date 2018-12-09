import * as drawable from '../drawables/drawable.js'
import * as entity from '../entities/entity.js'
import * as memFont from './mem-font.js'
import {AnimationID} from '../drawables/animation-id.js'
import {EntityID} from '../entities/entity-id.js'

/**
 * @typedef {Object} Layout
 * @prop {ReadonlyArray<XY|undefined>} positions The length of this array
 *                                               matches the string length.
 * @prop {XY} cursor The offset in pixels.
 */

/**
 * @arg {XY} position
 * @arg {string} string
 * @return {entity.State}
 */
export function newState(position, string) {
  return entity.newState(
    EntityID.TEXT,
    drawables(string, 0, {w: 80, h: 80}),
    position
  )
}

/**
 * @arg {string} string
 * @arg {number} y The vertical scroll offset in pixels.
 * @arg {WH} size The window size in pixels.
 * @return {ReadonlyArray<drawable.State>}
 */
export function drawables(string, y, size) {
  const drawables = []
  const positions = layout(string, size.w).positions
  for (let i = 0; i < positions.length; ++i) {
    const position = positions[i]
    if (!position) continue
    if (position.y + memFont.lineHeight + memFont.leading < y) continue
    if (position.y > y + size.h) break

    const id = 'MEM_FONT_' + string.charCodeAt(i)
    const d = drawable.newState(
      /** @type {Record<string, string>} */ (AnimationID)[id],
      {x: position.x, y: position.y - y}
    )
    drawables.push(d)
  }
  return drawables
}

/**
 * @arg {string} string
 * @arg {number} width The allowed layout width in pixels.
 * @return {Layout}
 */
export function layout(string, width) {
  /** @type {(XY|undefined)[]} */ const positions = []
  let cursor = {x: 0, y: 0}
  for (let i = 0; i < string.length; ) {
    let layout
    if (string[i] === '\n') {
      layout = layoutNewline(cursor)
    } else if (/\s/.test(string[i])) {
      layout = layoutSpace(
        cursor,
        width,
        interLetterWidth(string[i], string[i + 1])
      )
    } else {
      layout = layoutWord(cursor, width, string, i)
      if (
        cursor.x &&
        layout.cursor.y - cursor.y === memFont.lineHeight + memFont.leading
      ) {
        const wordWidth = width - cursor.x + layout.cursor.x
        if (wordWidth <= width) {
          // Word can fit on one line if cursor is reset to the start of the
          // line.
          cursor.x = 0
          cursor.y += memFont.lineHeight + memFont.leading
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
 * @arg {XY} cursor The current offset in pixels.
 * @return {Layout}
 */
function layoutNewline({y}) {
  return {
    positions: [undefined],
    cursor: {x: 0, y: y + memFont.lineHeight + memFont.leading}
  }
}

/**
 * @arg {XY} cursor The current offset in pixels.
 * @arg {number} width The allowed layout width in pixels.
 * @arg {number} interLetterWidth The distance in pixels from the start of the
 *                                current letter to the start of the next.
 * @return {Layout}
 */
function layoutSpace({x, y}, width, interLetterWidth) {
  return {
    positions: [undefined],
    cursor:
      x && x + interLetterWidth >= width
        ? {x: 0, y: y + memFont.lineHeight + memFont.leading}
        : {x: x + interLetterWidth, y}
  }
}

/**
 * @arg {XY} cursor The current offset in pixels.
 * @arg {number} width The allowed layout width in pixels.
 * @arg {string} string
 * @arg {number} index
 * @return {Layout}
 */
export function layoutWord({x, y}, width, string, index) {
  const positions = []
  while (index < string.length && !/\s/.test(string[index])) {
    const iLW = interLetterWidth(string[index], string[index + 1])
    if (x && x + iLW > width) {
      x = 0
      y += memFont.lineHeight + memFont.leading
    }
    positions.push({x, y: y + memFont.letterOffset(string[index])})
    x += iLW
    ++index
  }
  return {positions, cursor: {x, y}}
}

/**
 * @arg {string} lhs
 * @arg {string} [rhs]
 * @return {number} The distance in pixels from the start of lhs to the start of
 *                  rhs.
 */
function interLetterWidth(lhs, rhs) {
  return memFont.letterWidth(lhs) + memFont.kerning(lhs, rhs)
}
