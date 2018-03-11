export type GL = WebGLRenderingContext
export type GLProgram = WebGLProgram
export type GLShader = WebGLShader
export type GLTexture = WebGLTexture
export type GLUniformLocation = WebGLUniformLocation

export function check(gl: GL | null): GL {
  if (!gl) throw new Error('WebGL context unobtainable.')

  type Indexed = {[prop: string]: any}
  const proto: GL = Object.getPrototypeOf(gl)
  return Object.assign(
    gl,
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
      })),
    {
      getError: proto.getError,
      compileShader(shader: GLShader | null) {
        proto.compileShader.apply(gl, arguments)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const log = gl.getShaderInfoLog(shader)
          throw new Error(`Shader compilation failed: ${log}`)
        }
      },
      linkProgram(program: GLProgram | null) {
        proto.linkProgram.apply(gl, arguments)
        gl.validateProgram(program)

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          const log = gl.getProgramInfoLog(program)
          throw new Error(`Shader linking failed: ${log}`)
        }
      }
    }
  )
}
