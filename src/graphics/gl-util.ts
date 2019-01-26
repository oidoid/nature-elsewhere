import {Attribute} from './shader'

const GL = WebGLRenderingContext

export function initAttribute(
  gl: GL,
  program: GLProgram,
  attribute: Attribute,
  stride: number,
  divisor: number,
  buffer: GLBuffer
) {
  const location = gl.getAttribLocation(program, attribute.name)
  gl.enableVertexAttribArray(location)
  gl.bindBuffer(GL.ARRAY_BUFFER, buffer)
  gl.vertexAttribIPointer(
    location,
    attribute.length,
    attribute.type,
    stride,
    attribute.offset
  )
  gl.vertexAttribDivisor(location, divisor)
  gl.bindBuffer(GL.ARRAY_BUFFER, null)
}

export function buildProgram(
  gl: GL,
  vertexShaderSource: string,
  fragmentShaderSource: string
) {
  const program = gl.createProgram()
  if (program === null) throw new Error('WebGL program creation failed.')

  const vertexShader = compileShader(gl, GL.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = compileShader(
    gl,
    GL.FRAGMENT_SHADER,
    fragmentShaderSource
  )
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.useProgram(program)

  const log = gl.getProgramInfoLog(program)
  if (log) console.error(log)

  // Mark shaders for deletion when unused.
  gl.detachShader(program, fragmentShader)
  gl.detachShader(program, vertexShader)
  gl.deleteShader(fragmentShader)
  gl.deleteShader(vertexShader)

  return program
}

export function compileShader(gl: GL, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Shader creation failed.')

  gl.shaderSource(shader, source.trim())
  gl.compileShader(shader)

  const log = gl.getShaderInfoLog(shader)
  if (log) console.error(log)

  return shader
}

export function bufferData(
  gl: GL,
  buffer: GLBuffer,
  data: GLBufferData,
  usage: number
) {
  gl.bindBuffer(GL.ARRAY_BUFFER, buffer)
  gl.bufferData(GL.ARRAY_BUFFER, data, usage)
  gl.bindBuffer(GL.ARRAY_BUFFER, null)
}

export function loadTexture(
  gl: GL,
  textureUnit: number,
  image: HTMLImageElement
) {
  gl.activeTexture(textureUnit)
  const texture = gl.createTexture()
  gl.bindTexture(GL.TEXTURE_2D, texture)
  gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST)
  gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST)
  gl.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image)
  gl.bindTexture(GL.TEXTURE_2D, null)
  return texture
}
