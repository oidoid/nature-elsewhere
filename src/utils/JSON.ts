// https://github.com/Microsoft/TypeScript/issues/1897
export type JSONValue = string | number | boolean | JSONObject | JSONArray | {}
export interface JSONObject extends Record<string, JSONValue> {}
export interface JSONArray extends Array<JSONValue> {}
