export function load(
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
