import {Level0} from './assets/levels/level0'
import * as assetsLoader from './assets/asset-loader'
import * as shaderLoader from './gfx/glsl/shader-loader'
import * as enumUtil from './enum-util'
import * as gfx from './gfx/gfx'
import {check, GL, GLUniformLocation} from './gfx/gl'
import * as vertexSrc from './gfx/glsl/main.vert'
import * as fragmentSrc from './gfx/glsl/main.frag'
import * as kbd from './input/kbd'

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

  const ctx = shaderLoader.load(gl, vertexSrc, fragmentSrc)
  gl.useProgram(ctx.program)

  document.addEventListener('keydown', event => {
    const btn = kbd.defaultControllerMap[event.key.toLowerCase()]
    // eslint-disable-next-line no-console
    console.log(`${event.key} => ${btn}`)
  })

  assetsLoader
    .load(enumUtil.toObject(Level0.Texture))
    .then(assets => loop(gl, ctx, assets, Date.now()))
  // todo: exit.
}

function resize(gl: GL, resolutionLocation: GLUniformLocation | null) {
  // The canvas is stretched to the width of the document proportionally.
  // Truncate the width to the lowest integer to so that the canvas height is
  // scaled to be equal to or slightly greater than the document height. If
  // Math.ceil() is used instead, the canvas will often not quite fill the
  // height of the document.
  const ratio = window.innerWidth / window.innerHeight
  const width = Math.trunc(HEIGHT * ratio) // window.devicePixelRatio
  gl.canvas.width = width
  gl.canvas.height = HEIGHT

  gl.uniform2f(resolutionLocation, width, HEIGHT)
  gl.viewport(0, 0, width, HEIGHT)
}

function loop(
  gl: GL,
  ctx: shaderLoader.ShaderContext,
  assets: assetsLoader.Assets<any>,
  timestamp: number
): void {
  const now = Date.now()
  window.requestAnimationFrame(() => loop(gl, ctx, assets, now))

  resize(gl, ctx.location('uResolution'))

  const step = (now - timestamp) / 1000
  render(gl, ctx, assets, step)
}

function render(
  gl: GL,
  ctx: shaderLoader.ShaderContext,
  assets: assetsLoader.Assets<any>,
  step: number
): void {
  const {r, g, b, a} = Level0.Map.backgroundColor
  gl.clearColor(r, g, b, a)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gfx.drawTextures(gl, ctx, assets, Level0.Map.drawables, step)
}

main(window)
