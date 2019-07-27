import {ObjectUtil} from '../utils/object-util'

export interface Font {
  /** Height of lines, not including descenders, in pixels. */
  letterHeight: number

  /** Distance between lines in pixels. */
  leading: number

  /** letterHeight + leading. */
  lineHeight: number

  /** Distance between letters in pixels. */
  kerning: Readonly<Record<string, number>> &
    Readonly<{
      default: number
      whitespace: number
      end: number
    }>

  /** Vertical top offset in pixels. */
  letterOffset: Readonly<Record<string, number>> & Readonly<{default: number}>

  /** Character width in pixels. */
  letterWidth: Readonly<Record<string, number>> & Readonly<{default: number}>
}

export namespace Font {
  export function kerning({kerning}: Font, lhs: string, rhs?: string): number {
    if (rhs === undefined) return kerning.end
    if (/\s/.test(lhs + rhs)) return kerning.whitespace
    return ObjectUtil.defaultIfAbsent(kerning, lhs + rhs, kerning.default)
  }

  export function letterOffset({letterOffset}: Font, char: string): number {
    return ObjectUtil.defaultIfAbsent(letterOffset, char, letterOffset.default)
  }

  export function letterWidth({letterWidth}: Font, char: string): number {
    return ObjectUtil.defaultIfAbsent(letterWidth, char, letterWidth.default)
  }
}
