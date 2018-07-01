import {keys} from '../util'

export type GL = WebGLRenderingContext
export type GLProgram = WebGLProgram
export type GLShader = WebGLShader
export type GLTexture = WebGLTexture
export type GLUniformLocation = WebGLUniformLocation

export function check(gl: GL | null): GL {
  if (!gl) throw new Error('WebGL context unobtainable.')

  const proto: GL = Object.getPrototypeOf(gl)
  const checked = keys(proto)
    .filter(prop => typeof gl[prop] === 'function')
    .reduce(
      (sum, prop) => ({
        ...sum,
        [prop]: function() {
          const ret = (<Function>proto[prop]).apply(gl, arguments)
          const err = gl.getError()
          if (err !== gl.NO_ERROR) {
            const invocation = `${prop}(${Array.from(arguments)}) => ${ret}`
            throw new Error(`${invocation}; getError() => ${err}`)
          }
          return ret
        }
      }),
      <GL>{}
    )

  return Object.assign(gl, checked, <Partial<GL>>{
    getError: proto.getError,
    compileShader(shader) {
      checked.compileShader.apply(gl, arguments)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader)
        throw new Error(`Shader compilation failed: ${log}`)
      }
    },
    createBuffer() {
      const buffer = checked.createBuffer.apply(gl, arguments)
      if (!buffer) throw new Error('Shader buffer creation failed.')
      return buffer
    },
    createProgram() {
      const program = checked.createProgram.apply(gl, arguments)
      if (!program) throw new Error('Shader program creation failed.')
      return program
    },
    createShader() {
      const shader = checked.createShader.apply(gl, arguments)
      if (!shader) throw new Error('Shader creation failed.')
      return shader
    },
    createTexture() {
      const texture = checked.createTexture.apply(gl, arguments)
      if (!texture) throw new Error('Shader texture creation failed.')
      return texture
    },
    getActiveAttrib(_program, index) {
      const attrib = checked.getActiveAttrib.apply(gl, arguments)
      if (!attrib) {
        throw new Error(`Shader attribute at index ${index} unknown.`)
      }
      return attrib
    },
    getAttribLocation(_program, name) {
      const location = checked.getAttribLocation.apply(gl, arguments)
      if (location < 0) {
        throw new Error(
          `Shader attribute with name "${name}" location unknown (${location}).`
        )
      }
      return location
    },
    getProgramParameter(_program, name) {
      const param = checked.getProgramParameter.apply(gl, arguments)
      if (param === null) {
        throw new Error(`Shader parameter with name "${name}" unknown.`)
      }
      return param
    },
    getUniformLocation(_program, name) {
      const location = checked.getUniformLocation.apply(gl, arguments)
      if (location === null || location < 0) {
        throw new Error(
          `Shader uniform with name "${name}" location unknown (${location}).`
        )
      }
      return location
    },
    linkProgram(program) {
      try {
        checked.linkProgram.apply(gl, arguments)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          throw new Error(`Shader linking failed.`)
        }

        checked.validateProgram(program)
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
          throw new Error(`Shader validation failed.`)
        }
      } catch (e) {
        const log = gl.getProgramInfoLog(program)
        e.msg += log
        throw e
      }
    }
  })
}
