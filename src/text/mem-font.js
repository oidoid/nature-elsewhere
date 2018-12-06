/** @type {number} */
export const lineHeightPx = 4

/** @type {number} */
export const leadingPx = 1

/**
 * @arg {string} lhs
 * @arg {string} [rhs]
 * @return {number}
 */
export function kerningPx(lhs, rhs) {
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
    case 'y.':
    case 'ys':
      return 0
  }
  return 1
}

/**
 * @arg {string} character
 * @return {number}
 */
export function characterYOffsetPx(character) {
  switch (character) {
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

/**
 * @arg {string} character
 * @return {number}
 */
export function characterWidthPx(character) {
  // prettier-ignore
  switch (character) {
    case '\n': return 1
    case ' ' : return 1
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
