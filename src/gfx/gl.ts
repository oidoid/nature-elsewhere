export type GL = WebGLRenderingContext
export type GLProgram = WebGLProgram
export type GLShader = WebGLShader
export type GLTexture = WebGLTexture
export type GLUniformLocation = WebGLUniformLocation

export function check(gl: GL | null): GL {
  if (!gl) throw new Error('WebGL context unobtainable.')

  const proto: GL = Object.getPrototypeOf(gl)
  return Object.assign(gl, {
    compileShader(shader: GLShader | null) {
      proto.compileShader.apply(gl, arguments)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(shader)
        const msg = `Shader compilation failed; error=${gl.getError()}:\n${log}`
        throw new Error(msg)
      }
    },
    createBuffer() {
      const buffer = proto.createBuffer.apply(gl, arguments)
      if (!buffer) {
        throw new Error(`Buffer creation failed; error=${gl.getError()}.`)
      }
      return buffer
    },
    createProgram() {
      const program = proto.createProgram.apply(gl, arguments)
      if (!program) {
        const msg = `Shader program creation failed; error=${gl.getError()}.`
        throw new Error(msg)
      }
      return program
    },
    createShader() {
      const shader = proto.createShader.apply(gl, arguments)
      if (!shader) {
        throw new Error(`Shader creation failed; error=${gl.getError()}.`)
      }
      return shader
    },
    createTexture() {
      const texture = proto.createTexture.apply(gl, arguments)
      if (!texture) {
        throw new Error(`Texture creation failed; error=${gl.getError()}.`)
      }
      return texture
    },
    getAttribLocation(_program: GLProgram, name: string) {
      const location = proto.getAttribLocation.apply(gl, arguments)
      if (location < 0) {
        const msg =
          'Shader attribute location unknown; ' +
          `name=${name} location=${location} error=${gl.getError()}.`
        throw new Error(msg)
      }
      return location
    },
    getUniformLocation(_program: GLProgram, name: string) {
      const location = proto.getUniformLocation.apply(gl, arguments)
      if (location === null || location < 0) {
        const msg =
          'Shader uniform location unknown; ' +
          `name=${name} location=${location} error=${gl.getError()}.`
        throw new Error(msg)
      }
      return location
    },
    linkProgram(program: GLProgram | null) {
      proto.linkProgram.apply(gl, arguments)
      gl.validateProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const error = gl.getError()
        const log = gl.getProgramInfoLog(program)
        const msg = `Shader program linking failed; error=${error}:\n${log}`
        throw new Error(msg)
      }
    }
  })
}
