export function toObject<T>(enumer: T): {[K in keyof T]: T[K]} {
  const entries = Object.entries(enumer).map(([key, val]) => ({[key]: val}))
  return Object.assign({}, ...entries)
}

export function index<T, K extends keyof T>(enumer: T, key: K): T[K] {
  return enumer[key]
}
