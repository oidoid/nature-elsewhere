export namespace LocalStorage {
  export function get(key: string): Maybe<string> {
    const val = localStorage.getItem(key)
    return val === null ? undefined : val
  }

  export function put(key: string, val?: string): void {
    if (val === undefined) localStorage.removeItem(key)
    else localStorage.setItem(key, val)
  }

  export function clear() {
    localStorage.clear()
  }
}
