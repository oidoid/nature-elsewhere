export namespace MemFont {
  /** Height of lines, not including descenders, in pixels. */
  export const lineHeight: number = 4

  /** Distance between lines, not including descenders, in pixels. */
  export const leading: number = 2

  /** @return Distance between letters in pixels. */
  export function kerning(lhs: string, rhs?: string): number {
    if (/\s/.test(lhs) || rhs === undefined || rhs === ',' || /\s/.test(rhs)) {
      return 0
    }
    switch (lhs + rhs) {
      case ",'":
      case ',"':
      case ',`':
      case ',,':
      case ".'":
      case '."':
      case '.`':
      case '..':
      case '::':
      case ';:':
      case ';;':
      case "_'":
      case '_"':
      case '_`':
      case '__':
      case "-'":
      case '-"':
      case '-`':
      case '--':
      case "'s":
      case "'d":
      case 'd;':
      case 'lt':
      case 'ly':
      case "n'":
      case 'rj':
      case 'rs':
      case 's.':
      case 'ss':
      case 'ts':
      case 'y.':
      case 'ys':
        return 0
    }
    return 1
  }

  /** @return Vertical top offset in pixels. */
  export function letterOffset(letter: string): number {
    switch (letter) {
      case ',':
      case ';':
      case 'g':
      case 'j':
      case 'p':
      case 'q':
        return 1
    }
    return 0
  }

  /** @return Character width in pixels. */
  export function letterWidth(letter: string): number {
    // prettier-ignore
    switch (letter) {
    case '\n': return 1
    case ' ' : return 2
    case '!' : return 1
    case "'" : return 1
    case '(' : return 2
    case ')' : return 2
    case ',' : return 2
    case '.' : return 1
    case ':' : return 1
    case ';' : return 2
    case '<' : return 2
    case '>' : return 2
    case '[' : return 2
    case ']' : return 2
    case '`' : return 2
    case 'f' : return 2
    case 'i' : return 1
    case 'l' : return 2
    case 'r' : return 2
    case '|' : return 1
  }
    return 3
  }
}
