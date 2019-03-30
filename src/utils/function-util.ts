export namespace FunctionUtil {
  export interface Never {
    (): Never
  }

  export interface Once {
    (execute: boolean): Once
  }

  export function never(): Never {
    return never
  }

  export function once(fnc: () => void): Once {
    return function retry(execute): Once {
      if (!execute) return retry
      fnc()
      return never
    }
  }
}
