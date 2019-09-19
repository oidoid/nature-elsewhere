import {Atlas} from '../atlas/atlas/atlas'
import {ShaderLayout} from '../graphics/shaders/shader-layout/shader-layout'

export interface Assets {
  readonly atlas: Atlas
  readonly atlasImage: HTMLImageElement
  readonly shaderLayout: ShaderLayout
}
