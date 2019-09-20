export namespace FunctionUtil {
  export type Never = {(): Never}
  export type Once = {(execute: boolean): Once}

  export function never(): Never {
    return never
  }

  export function once(fn: () => void): Once {
    return function retry(execute): Once {
      return execute ? (fn(), never) : retry
    }
  }
}
