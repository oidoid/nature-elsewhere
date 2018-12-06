import * as drawable from '../drawables/drawable.js'
import * as entity from '../entities/entity.js'
import * as memFont from './mem-font.js'
import {AnimationID} from '../drawables/animation-id.js'
import {EntityID} from '../entities/entity-id.js'

/**
 * @arg {XY} position
 * @arg {string} string
 * @return {entity.State}
 */
export function newState(position, string) {
  return entity.newState(
    EntityID.TEXT,
    drawables(string, {x: 0, y: 0, w: 80, h: 80}),
    position
  )
}

/**
 * @arg {string} string
 * @arg {Rect} bounds
 * @return {ReadonlyArray<drawable.State>}
 */
export function drawables(string, bounds) {
  const drawables = []
  const measurement = measure(string, bounds)
  loop: for (const line of measurement) {
    for (const character of line) {
      if (character.y + (memFont.lineHeightPx + memFont.leadingPx) < bounds.y)
        continue

      const id = 'MEM_FONT_' + character.character.charCodeAt(0)
      const d = drawable.newState(
        /** @type {Record<string, string>} */ (AnimationID)[id],
        {x: character.x, y: character.y - bounds.y}
      )
      if (character.y >= bounds.y + bounds.h) break loop
      drawables.push(d)
    }
  }
  return drawables
}

/**
 * @arg {string} string
 * @arg {Rect} bounds
 * @return {(XY & {character: string})[][]}
 */
function measure(string, bounds) {
  let i = 0
  let x = 0
  let y = 0
  /** @type {(XY & {character: string})[][]} */ const lines = [[]]
  let line = 0
  for (const character of string) {
    if (
      (x &&
        x + measureWord(string.slice(i)) > bounds.w &&
        measureWord(string.slice(i)) <= bounds.w) ||
      x + memFont.characterWidthPx(character) > bounds.w
    ) {
      x = 0
      y += memFont.lineHeightPx + memFont.leadingPx
      ++line
      lines[line] = []
      if (!/\s/.test(character)) {
        lines[line].push({
          x,
          y: y + memFont.characterYOffsetPx(character),
          character
        })
        x += measureCharacter(character, string[i + 1])
      }
    } else {
      lines[line].push({
        x,
        y: y + memFont.characterYOffsetPx(character),
        character
      })
      x += measureCharacter(character, string[i + 1])
    }
    ++i
  }
  return lines
}

/**
 * @arg {string} string
 * @return {number} The width in pixels of the first word in string excluding
 *                  whitespace.
 */
export function measureWord(string) {
  let width = 0
  for (let i = 0; i < string.length && !/\s/.test(string[i]); ++i) {
    width += measureCharacter(string[i], string[i + 1])
  }
  return width
}

/**
 * @arg {string} lhs
 * @arg {string} [rhs]
 * @return {number} The distance in pixels to the next character.
 */
function measureCharacter(lhs, rhs) {
  return memFont.characterWidthPx(lhs) + memFont.kerningPx(lhs, rhs)
}
