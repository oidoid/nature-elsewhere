export namespace FunctionUtil {
  export type Never = {(): Never}
  export type Once = {(execute: boolean): Once}

  export const never = (): Never => never

  export const once = (fn: () => void): Once =>
    function retry(execute): Once {
      return execute ? (fn(), never) : retry
    }
}
