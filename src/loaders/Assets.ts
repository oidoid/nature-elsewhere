import {Atlas} from '../atlas/Atlas'
import {ShaderLayout} from '../graphics/shaders/shaderLayout/ShaderLayout'

export interface Assets {
  readonly atlas: Atlas
  readonly atlasImage: HTMLImageElement
  readonly shaderLayout: ShaderLayout
}
