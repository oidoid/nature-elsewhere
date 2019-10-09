// https://github.com/Microsoft/TypeScript/issues/1897
export type JSON = string | number | boolean | JSONObject | JSONArray
export interface JSONObject extends Record<string, JSON> {}
export interface JSONArray extends Array<JSON> {}
