export namespace StringUtil {
  export function localeCompare(
    lhs: string,
    rhs: string,
    locales?: string | string[],
    options?: Intl.CollatorOptions
  ): number {
    return lhs.localeCompare(rhs, locales, options)
  }
}
