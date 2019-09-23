import {ObjectUtil} from '../ObjectUtil'

// https://github.com/Microsoft/TypeScript/issues/1897
export type JSON = string | number | boolean | JSONObject | JSONArray
export interface JSONObject extends Readonly<Record<string, JSON>> {}
export interface JSONArray extends ReadonlyArray<JSON> {}

export namespace JSONUtil {
  export function merge(...objects: readonly JSONObject[]): JSONObject {
    return objects
      .map(ObjectUtil.entries)
      .reduce((entries, entriesArray) => entries.concat(entriesArray), [])
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

  export function copy<T>(val: Readonly<T> & JSON): T {
    return JSON.parse(JSON.stringify(val))
  }
}

function isJSONObject(val: JSON): val is JSONObject {
  return ObjectUtil.is(val)
}
