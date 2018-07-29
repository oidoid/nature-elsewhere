// https://github.com/Microsoft/TypeScript/issues/1897
type JSONPrimitive = string | number | boolean | null

type JSONValue = JSONPrimitive | JSONObject | JSONArray

interface JSONObject extends Record<string, JSONValue> {}

interface JSONArray extends Array<JSONValue> {}
