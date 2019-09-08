import {ObjectUtil} from '../utils/object-util'

export interface Font {
  /** Height of lines, not including descenders, in pixels. */
  readonly letterHeight: number

  /** Distance between lines in pixels. */
  readonly leading: number

  /** letterHeight + leading. */
  readonly lineHeight: number

  /** Distance between letters in pixels. */
  readonly kerning: Readonly<Record<string, number>>
  readonly defaultKerning: number
  readonly whitespaceKerning: number
  readonly endOfLineKerning: number

  /** Vertical top offset in pixels. */
  readonly letterOffset: Readonly<Record<string, number>>
  readonly defaultLetterOffset: number

  /** Character width in pixels. */
  readonly letterWidth: Readonly<Record<string, number>>
  readonly defaultLetterWidth: number
}
type t = Font

export namespace Font {
  export const kerning = (font: t, lhs: string, rhs?: string): number => {
    if (rhs === undefined) return font.endOfLineKerning
    if (/\s/.test(lhs + rhs)) return font.whitespaceKerning
    return ObjectUtil.defaultIfAbsent(
      font.kerning,
      lhs + rhs,
      font.defaultKerning
    )
  }

  export const letterOffset = (font: t, char: string): number =>
    ObjectUtil.defaultIfAbsent(
      font.letterOffset,
      char,
      font.defaultLetterOffset
    )

  export const letterWidth = (font: t, char: string): number =>
    ObjectUtil.defaultIfAbsent(font.letterWidth, char, font.defaultLetterWidth)
}
