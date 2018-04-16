import {GL, GLProgram, GLUniformLocation} from '../gl'

export type ShaderContext = {
  program: GLProgram | null
  location(name: string): number
  location(name: string): GLUniformLocation | null
}
type Locations = {[name: string]: number | GLUniformLocation | null}
type UniformLocations = {[name: string]: GLUniformLocation | null}
type AttributeLocations = {[name: string]: number}

export function load(
  gl: GL,
  vertexSrc: string,
  fragmentSrc: string
): ShaderContext {
  const program = loadShaders(gl, vertexSrc, fragmentSrc)
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
  vertexSrc: string,
  fragmentSrc: string
): GLProgram | null {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexSrc)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentSrc)

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

  Object.keys(attrs).forEach(name => {
    const overlap = uniforms[name] !== undefined
    if (overlap) {
      throw new Error(`Shader attribute and uniform name "${name}" conflicts.`)
    }
  })

  return Object.assign(attrs, uniforms)
}

function getAttributeLocations(
  gl: GL,
  program: GLProgram | null
): AttributeLocations {
  const locations: AttributeLocations = {}
  const end = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES) || 0
  for (let i = 0; i < end; ++i) {
    const attr = gl.getActiveAttrib(program, i)
    locations[attr ? attr.name : i] = i
  }
  return locations
}

function getUniformLocations(
  gl: GL,
  program: GLProgram | null
): UniformLocations {
  const locations: UniformLocations = {}
  const end = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) || 0
  for (let i = 0; i < end; ++i) {
    const uniform = gl.getActiveUniform(program, i)
    if (uniform) {
      locations[uniform.name] = gl.getUniformLocation(program, uniform.name)
    }
  }
  return locations
}

export function unload(gl: GL, program: GLProgram | null): void {
  gl.deleteProgram(program)
}
