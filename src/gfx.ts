export function getAttribLocation(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string
): number {
  const location = gl.getAttribLocation(program, name)
  if (location < 0) {
    const msg =
      'Shader attribute location unknown; ' +
      `name=${name} location=${location} error=${gl.getError()}.`
    throw new Error(msg)
  }
  return location
}

export function getUniformLocation(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string
): WebGLUniformLocation {
  const location = gl.getUniformLocation(program, name)
  if (location === null || location < 0) {
    const msg =
      'Shader uniform location unknown; ' +
      `name=${name} location=${location} error=${gl.getError()}.`
    throw new Error(msg)
  }
  return location
}

export function createBuffer(gl: WebGLRenderingContext): WebGLBuffer {
  const buffer = gl.createBuffer()
  if (!buffer) {
    throw new Error(`Buffer creation failed; error=${gl.getError()}.`)
  }
  return buffer
}
