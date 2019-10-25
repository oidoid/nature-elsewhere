interface GL extends WebGLRenderingContext {}
type GLBuffer = WebGLBuffer | null
type GLBufferData = Parameters<GL['bufferData']>[1]
type GLDataType =
  | 'BYTE'
  | 'UNSIGNED_BYTE'
  | 'SHORT'
  | 'UNSIGNED_SHORT'
  | 'INT'
  | 'UNSIGNED_INT'
  | 'FLOAT'
type GLLoseContext = WEBGL_lose_context | null
type GLProgram = WebGLProgram | null
interface GLShader extends WebGLShader {}
type GLTexture = WebGLTexture | null
type GLUniformLocation = WebGLUniformLocation | null
