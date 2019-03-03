import {AttributeLocations, UniformLocations} from './gl-util'
import {GLUtil} from './gl-util'

export class ShaderCache {
  static new(gl: GL, program: GLProgram): ShaderCache {
    const uniforms = GLUtil.getUniformLocations(gl, program)
    const attributes = GLUtil.getAttributeLocations(gl, program)
    return new ShaderCache(program, uniforms, attributes)
  }

  constructor(
    private readonly _program: GLProgram,
    private readonly _uniformLocations: UniformLocations,
    private readonly _attributeLocations: AttributeLocations
  ) {}

  program(): GLProgram {
    return this._program
  }

  location(name: string): number
  location(name: string): GLUniformLocation {
    const location =
      this._uniformLocations[name] || this._attributeLocations[name]
    if (location === undefined) throw new Error(`Unknown variable "${name}".`)
    return location
  }
}
