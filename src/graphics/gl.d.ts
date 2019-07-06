interface GL extends WebGL2RenderingContext {}
type GLBuffer = WebGLBuffer | null
type GLBufferData = Parameters<GL['bufferData']>[1]
type GLContextAttributes = WebGLContextAttributes | undefined
type GLLoseContext = WEBGL_lose_context | null
type GLProgram = WebGLProgram
interface GLShader extends WebGLShader {}
type GLTexture = WebGLTexture | null
type GLUniformLocation = WebGLUniformLocation | null
