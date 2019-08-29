import {Atlas} from '../atlas/atlas'
import {ShaderLayout} from '../graphics/shaders/shader-layout'

export interface Assets {
  readonly atlas: Atlas
  readonly atlasImage: HTMLImageElement
  readonly shaderLayout: ShaderLayout
}
