import {ObjectUtil} from '../object-util'

// https://github.com/Microsoft/TypeScript/issues/1897
export type JSON = string | number | boolean | JSONObject | JSONArray
export interface JSONObject extends Readonly<Record<string, JSON>> {}
export interface JSONArray extends ReadonlyArray<JSON> {}
type t = JSON

export namespace JSONUtil {
  export const merge = (...val: readonly JSONObject[]): JSONObject => {
    return val
      .map(ObjectUtil.entries)
      .reduce((ret, val) => ret.concat(val), [])
      .reduce((ret: JSONObject, [key, val]) => {
        const prev = ret[key]
        if (isJSONObject(prev) && isJSONObject(val)) val = merge(prev, val)
        else if (Array.isArray(prev))
          val = prev.concat(
            isJSONObject(val) || Array.isArray(val) ? copy(<any>val) : val
          )
        else if (isJSONObject(val) || Array.isArray(val)) val = copy(<any>val)
        return {...ret, [key]: val}
      }, {})
  }

  export const copy = <T>(val: Readonly<T> & t): T =>
    JSON.parse(JSON.stringify(val))
}

const isJSONObject = (val: t): val is JSONObject => ObjectUtil.is(val)
