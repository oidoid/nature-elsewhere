import {ShaderLayout} from './ShaderLayout'

const GL = WebGLRenderingContext

export namespace GLUtil {
  export const initAttribute = (
    gl: GL,
    instancedArrays: ANGLE_instanced_arrays,
    stride: number,
    divisor: number,
    buffer: GLBuffer,
    location: number,
    {type, len, offset}: ShaderLayout.Attribute
  ): void => {
    gl.enableVertexAttribArray(location)
    gl.bindBuffer(GL.ARRAY_BUFFER, buffer)
    gl.vertexAttribPointer(location, len, GL[type], false, stride, offset)
    instancedArrays.vertexAttribDivisorANGLE(location, divisor)
    gl.bindBuffer(GL.ARRAY_BUFFER, null)
  }

  export const loadProgram = (
    gl: GL,
    vertexGLSL: string,
    fragmentGLSL: string
  ): GLProgram => {
    const program = gl.createProgram()
    if (!program) return null

    const vertexShader = compileShader(gl, GL.VERTEX_SHADER, vertexGLSL)
    const fragmentShader = compileShader(gl, GL.FRAGMENT_SHADER, fragmentGLSL)
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

  export const compileShader = (
    gl: GL,
    type: number,
    source: string
  ): GLShader => {
    const shader = gl.createShader(type)
    if (!shader) throw new Error('Shader creation failed.')

    gl.shaderSource(shader, source.trim())
    gl.compileShader(shader)

    const log = gl.getShaderInfoLog(shader)
    if (log) console.error(log)

    return shader
  }

  export const bufferData = (
    gl: GL,
    buffer: GLBuffer,
    data: GLBufferData,
    usage: number
  ): void => {
    gl.bindBuffer(GL.ARRAY_BUFFER, buffer)
    gl.bufferData(GL.ARRAY_BUFFER, data, usage)
    gl.bindBuffer(GL.ARRAY_BUFFER, null)
  }

  export const loadTexture = (
    gl: GL,
    textureUnit: number,
    image: HTMLImageElement
  ): GLTexture => {
    gl.activeTexture(textureUnit)
    const texture = gl.createTexture()
    gl.bindTexture(GL.TEXTURE_2D, texture)
    gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST)
    gl.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST)
    gl.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, image)
    gl.bindTexture(GL.TEXTURE_2D, null)
    return texture
  }

  export const uniformLocations = (
    gl: GL,
    program: GLProgram
  ): Readonly<Record<string, GLUniformLocation>> => {
    if (!program) return {}
    const len = gl.getProgramParameter(program, GL.ACTIVE_UNIFORMS)
    const locations: Record<string, GLUniformLocation> = {}
    for (let i = 0; i < len; ++i) {
      const uniform = gl.getActiveUniform(program, i)
      if (!uniform) throw new Error(`Can't get uniform at index ${i}.`)
      locations[uniform.name] = gl.getUniformLocation(program, uniform.name)
    }
    return locations
  }

  export const attributeLocations = (
    gl: GL,
    program: GLProgram
  ): Readonly<Record<string, number>> => {
    if (!program) return {}
    const len = gl.getProgramParameter(program, GL.ACTIVE_ATTRIBUTES)
    const locations: Record<string, number> = {}
    for (let i = 0; i < len; ++i) {
      const attr = gl.getActiveAttrib(program, i)
      if (!attr) throw new Error(`Can't get attribute at index ${i}.`)
      locations[attr.name] = gl.getAttribLocation(program, attr.name)
    }
    return locations
  }
}
