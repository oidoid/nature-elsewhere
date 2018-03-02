export function wrap(gl: WebGLRenderingContext | null): WebGLRenderingContext {
  if (!gl) throw new Error('WebGL context unobtainable.')

  const proto: WebGLRenderingContext = Object.getPrototypeOf(gl)
  return Object.assign(gl, {
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
    getAttribLocation(_program: WebGLProgram, name: string) {
      const location = proto.getAttribLocation.apply(gl, arguments)
      if (location < 0) {
        const msg =
          'Shader attribute location unknown; ' +
          `name=${name} location=${location} error=${gl.getError()}.`
        throw new Error(msg)
      }
      return location
    },
    getUniformLocation(_program: WebGLProgram, name: string) {
      const location = proto.getUniformLocation.apply(gl, arguments)
      if (location === null || location < 0) {
        const msg =
          'Shader uniform location unknown; ' +
          `name=${name} location=${location} error=${gl.getError()}.`
        throw new Error(msg)
      }
      return location
    }
  })
}
