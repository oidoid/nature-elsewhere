import {GL, GLProgram, GLUniformLocation} from '../gl'

export type AttributeLocations = {[name: string]: number}
export type UniformLocations = {[name: string]: GLUniformLocation | null}
export type ShaderContext = {
  program: GLProgram | null
  attr: AttributeLocations
  uniform: UniformLocations
}

export function load(
  gl: GL,
  vertexSrc: string,
  fragmentSrc: string
): ShaderContext {
  const program = loadShaders(gl, vertexSrc, fragmentSrc)
  return {
    program,
    attr: getAttributeLocations(gl, program),
    uniform: getUniformLocations(gl, program)
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
