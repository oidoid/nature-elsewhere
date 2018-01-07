export function loadShaderProgram(
  gl: WebGLRenderingContext,
  vertexShaderSrc: string,
  fragmentShaderSrc: string
): WebGLProgram {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSrc)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc)

  const program = gl.createProgram()
  if (!program) {
    throw new Error(`Shader program creation failed; error=${gl.getError()}`)
  }

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  gl.linkProgram(program)
  gl.validateProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(
      `Shader program linking failed; error=${gl.getError()}:\n${log}`
    )
  }

  return program
}

function loadShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) {
    throw new Error(`Shader creation failed; error=${gl.getError()}.`)
  }

  gl.shaderSource(shader, src)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(
      `Shader compilation failed; error=${gl.getError()}:\n${log}`
    )
  }

  return shader
}

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
