export function load(
  gl: WebGLRenderingContext,
  vertexShaderSrc: string,
  fragmentShaderSrc: string
): WebGLProgram | null {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSrc)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc)

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  return program
}

export function unload(
  gl: WebGLRenderingContext,
  program: WebGLProgram | null,
  vertexShader: WebGLShader | null,
  fragmentShader: WebGLShader | null
): void {
  gl.detachShader(program, fragmentShader)
  gl.detachShader(program, vertexShader)
  gl.deleteShader(fragmentShader)
  gl.deleteShader(vertexShader)
  gl.deleteProgram(program)
}

function loadShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string
): WebGLShader | null {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  return shader
}
