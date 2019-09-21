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

export namespace Font {
  export function kerning(font: Font, lhs: string, rhs?: string): number {
    if (rhs === undefined) return font.endOfLineKerning
    if (/\s/.test(lhs + rhs)) return font.whitespaceKerning
    const kerning = font.kerning[lhs + rhs]
    return kerning === undefined ? font.defaultKerning : kerning
  }

  export function letterOffset(font: Font, char: string): number {
    const offset = font.letterOffset[char]
    return offset === undefined ? font.defaultLetterOffset : offset
  }

  export function letterWidth(font: Font, char: string): number {
    const width = font.letterWidth[char]
    return width === undefined ? font.defaultLetterWidth : width
  }
}
