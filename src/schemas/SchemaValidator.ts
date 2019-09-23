import * as Ajv from 'ajv'
import {Definition, Schema} from './Schema'
import {JSON, JSONUtil} from '../utils/jsonUtil/JSONUtil'
import {ObjectUtil} from '../utils/ObjectUtil'
const ajvMergePatch = require('ajv-merge-patch')

const options: Ajv.Options = Object.freeze({
  format: 'full',
  schemas: Schema,
  extendRefs: 'fail',
  useDefaults: true,
  // strictDefaults: true,
  strictKeywords: true
})

export namespace SchemaValidator {
  /** This function mutates the input JSON with defaults. Defaults required for
      validation should be merged prior to calling. */
  export function validate(json: JSON, definition: Definition): JSON {
    const ajv = new Ajv(options)
    ajvMergePatch(ajv)
    ajv.addKeyword('deepDefaults', {
      modifying: true,
      validate: deepDefaultsValidator
    })
    const validate = ajv.compile(definition)
    const valid = validate(json)
    if (!valid) throw validate.errors
    return json
  }
}

/** Defaults are never validated outside of this function. Additionally,
    defaults are usually not applied for sub-schemas
    (https://github.com/epoberezkin/ajv/issues/337) and are shallow. */
function deepDefaultsValidator(
  deepDefaults: boolean,
  data: any,
  schema: any
): boolean {
  if (!deepDefaults) return true
  for (const key in schema.properties) {
    const schemaProp = schema.properties[key]
    if (!('default' in schemaProp)) continue

    if (ObjectUtil.is(schemaProp.default))
      data[key] = JSONUtil.merge(schemaProp.default, data[key])
    else if (Array.isArray(schemaProp.default))
      data[key] = (<any[]>JSONUtil.copy(schemaProp.default)).concat(
        key in data ? JSONUtil.copy(data[key]) : []
      )
    else if (key in data) data[key] = data[key]
    else data[key] = schemaProp.default
  }
  return true
}
