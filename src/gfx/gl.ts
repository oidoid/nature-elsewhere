export type GL = WebGLRenderingContext
export type GLProgram = WebGLProgram
export type GLShader = WebGLShader
export type GLTexture = WebGLTexture
export type GLUniformLocation = WebGLUniformLocation

export function check(gl: GL | null): GL {
  if (!gl) throw new Error('WebGL context unobtainable.')

  type Indexed = {[prop: string]: any}
  const proto: GL = Object.getPrototypeOf(gl)
  const checked: GL = Object.assign(
    {},
    ...Object.keys(proto)
      .filter(prop => typeof (<Indexed>gl)[prop] === 'function')
      .map(prop => ({
        [prop]: function() {
          const ret = (<Indexed>proto)[prop].apply(gl, arguments)
          const err = gl.getError()
          if (err !== gl.NO_ERROR) {
            const invocation = `${prop}(${Array.from(arguments)}) => ${ret}`
            throw new Error(`${invocation}; getError() => ${err}`)
          }
          return ret
        }
      }))
  )

  return Object.assign(gl, checked, {
    getError: proto.getError,
    compileShader(shader: GLShader | null) {
      checked.compileShader.apply(gl, arguments)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader)
        throw new Error(`Shader compilation failed: ${log}`)
      }
    },
    createBuffer() {
      const buffer = checked.createBuffer.apply(gl, arguments)
      if (!buffer) throw new Error('Buffer creation failed.')
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
      if (!texture) throw new Error('Texture creation failed.')
      return texture
    },
    getAttribLocation(_program: GLProgram, name: string) {
      const location = checked.getAttribLocation.apply(gl, arguments)
      if (location < 0) {
        const msg =
          'Shader attribute location unknown; ' +
          `name=${name} location=${location}.`
        throw new Error(msg)
      }
      return location
    },
    getUniformLocation(_program: GLProgram, name: string) {
      const location = checked.getUniformLocation.apply(gl, arguments)
      if (location === null || location < 0) {
        const msg =
          'Shader uniform location unknown; ' +
          `name=${name} location=${location}.`
        throw new Error(msg)
      }
      return location
    },
    linkProgram(program: GLProgram | null) {
      checked.linkProgram.apply(gl, arguments)
      gl.validateProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const log = gl.getProgramInfoLog(program)
        throw new Error(`Shader linking failed: ${log}`)
      }
    }
  })
}
