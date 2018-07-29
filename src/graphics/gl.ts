export type GL = WebGL2RenderingContext
export const GL = WebGL2RenderingContext
export type GLProgram = WebGLProgram
export type GLShader = WebGLShader
export type GLTexture = WebGLTexture
export type GLUniformLocation = WebGLUniformLocation

export function check(gl: GL | null) {
  if (!gl) throw new Error('WebGL context unobtainable.')

  const proto: WebGLRenderingContext = Object.getPrototypeOf(gl)
  return Object.assign(gl, <Partial<WebGLRenderingContext>>{
    compileShader(shader) {
      proto.compileShader.apply(gl, arguments)
      const log = gl.getShaderInfoLog(shader)
      if (log) console.error(log)
    },
    linkProgram(program) {
      proto.linkProgram.apply(gl, arguments)
      const log = gl.getProgramInfoLog(program)
      if (log) console.error(log)
    }
  })
}
