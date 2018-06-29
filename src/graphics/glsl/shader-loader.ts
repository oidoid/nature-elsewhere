import {GL, GLProgram, GLUniformLocation} from '../gl'
import {range} from '../../util'

export type ShaderContext = {
  readonly program: GLProgram | null
  location(name: string): number
  location(name: string): GLUniformLocation | null
}
type Locations = {readonly [name: string]: number | GLUniformLocation | null}
type UniformLocations = {readonly [name: string]: GLUniformLocation | null}
type AttributeLocations = {readonly [name: string]: number}

export function load(
  gl: GL,
  vertexSource: string,
  fragmentSource: string
): ShaderContext {
  const program = loadShaders(gl, vertexSource, fragmentSource)
  const locations = getLocations(gl, program)
  return {
    program,
    location(name: string): any {
      const location = locations[name]
      if (location !== undefined) return location
      throw new Error(`Shader location with name "${name}" unknown.`)
    }
  }
}

function loadShaders(
  gl: GL,
  vertexSource: string,
  fragmentSource: string
): GLProgram | null {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSource)

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  // Mark shaders for deletion when not in use.
  gl.detachShader(program, fragmentShader)
  gl.detachShader(program, vertexShader)
  gl.deleteShader(fragmentShader)
  gl.deleteShader(vertexShader)

  return program
}

function loadShader(gl: GL, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  return shader
}

function getLocations(gl: GL, program: GLProgram | null): Locations {
  const attrs = getAttributeLocations(gl, program)
  const uniforms = getUniformLocations(gl, program)

  const conflict = Object.keys(attrs).find(name => uniforms[name] !== undefined)
  if (conflict) {
    throw new Error(
      `Shader attribute and uniform name "${conflict}" conflicts.`
    )
  }

  return {...attrs, ...uniforms}
}

function getAttributeLocations(
  gl: GL,
  program: GLProgram | null
): AttributeLocations {
  const end = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES) || 0
  return range(0, end).reduce((sum, i) => {
    const attr = gl.getActiveAttrib(program, i)
    return {...sum, [attr ? attr.name : i]: i}
  }, {})
}

function getUniformLocations(
  gl: GL,
  program: GLProgram | null
): UniformLocations {
  const end = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) || 0
  return range(0, end).reduce((sum, i) => {
    const uniform = gl.getActiveUniform(program, i)
    return {
      ...sum,
      [uniform ? uniform.name : i]: uniform
        ? gl.getUniformLocation(program, uniform.name)
        : null
    }
  }, {})
}

export function unload(gl: GL, program: GLProgram | null): void {
  gl.deleteProgram(program)
}
