import * as Level0 from './levels/level0'
import * as assetsLoader from './assets/asset-loader'
import * as shaderLoader from './gfx/glsl/shader-loader'
import * as enumUtil from './enum-util'
import * as gfx from './gfx/gfx'
import {check, GLProgram, GL, GLUniformLocation} from './gfx/gl'
import * as vertexShaderSrc from './gfx/glsl/main.vert'
import * as fragmentShaderSrc from './gfx/glsl/main.frag'

const HEIGHT = 128

function main(window: Window) {
  const canvas = window.document.querySelector('canvas')
  if (!canvas) throw new Error('Canvas missing in document.')

  const gl = check(
    canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: true
    })
  )

  // Allow translucent textures to be layered.
  gl.enable(gl.BLEND)
  gl.blendEquation(gl.FUNC_ADD)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  const program = shaderLoader.load(gl, vertexShaderSrc, fragmentShaderSrc)
  gl.useProgram(program)
  // todo: delete program.

  const resolutionLocation = gl.getUniformLocation(program, 'uResolution')
  resize(gl, resolutionLocation)
  window.addEventListener('resize', () => resize(gl, resolutionLocation))
  // todo: remove event listener.

  assetsLoader
    .load(enumUtil.toObject(Level0.Texture))
    .then(assets => [
      {
        location: {x: 32, y: 64},
        bounds: {
          width: enumUtil.index(assets, Level0.Texture.WATER).image.width,
          height: enumUtil.index(assets, Level0.Texture.WATER).image.height
        },
        texture: enumUtil.index(assets, Level0.Texture.WATER)
      },
      {
        location: {x: 32, y: 64},
        bounds: {
          width: enumUtil.index(assets, Level0.Texture.REFLECTIONS).image.width,
          height: enumUtil.index(assets, Level0.Texture.REFLECTIONS).image
            .height
        },
        texture: enumUtil.index(assets, Level0.Texture.REFLECTIONS)
      },
      {
        location: {x: 32, y: 64},
        bounds: {
          width: enumUtil.index(assets, Level0.Texture.POND).image.width,
          height: enumUtil.index(assets, Level0.Texture.POND).image.height
        },
        texture: enumUtil.index(assets, Level0.Texture.POND)
      }
    ])
    .then(drawables => loop(gl, program, drawables))
  // todo: exit.
}
// let timestamp = Date.now()
function loop(
  gl: GL,
  program: GLProgram | null,
  drawables: gfx.Drawable<any, any>[]
): void {
  // const now = Date.now()
  // const step = 60 * (now - timestamp) / 1000
  // timestamp = now

  render(gl, program, drawables)
  window.requestAnimationFrame(() => loop(gl, program, drawables))
}

function render(
  gl: GL,
  program: GLProgram | null,
  drawables: gfx.Drawable<any, any>[]
): void {
  gl.clearColor(0.956862745, 0.956862745, 0.929411765, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gfx.drawTextures(gl, program, drawables)
}

function resize(gl: GL, resolutionLocation: GLUniformLocation | null): void {
  // The canvas is stretched to the width of the document proportionally.
  // Truncate the width to the lowest integer to so that the canvas height is
  // scaled to be equal to or slightly greater than the document height. If
  // Math.ceil() is used instead, the canvas will often not quite fill the
  // height of the document.
  const ratio = window.innerWidth / window.innerHeight
  const width = Math.trunc(HEIGHT * ratio)

  // eslint-disable-next-line no-console
  console.log(
    [
      'resize:',
      `window=${window.innerWidth}x${window.innerHeight}`,
      `canvas=${width}x${HEIGHT}`,
      `ratio=${ratio}`,
      `scale=${window.innerHeight / HEIGHT}`
    ].join(' ')
  )

  gl.canvas.width = width
  gl.canvas.height = HEIGHT

  gl.uniform2f(resolutionLocation, width, HEIGHT)
  gl.viewport(0, 0, width, HEIGHT)
}

main(window)
