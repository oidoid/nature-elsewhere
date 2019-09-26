import {Atlas} from '../atlas/Atlas'
import {ShaderLayout} from '../graphics/shaders/ShaderLayout'

export interface Assets {
  readonly atlas: Atlas
  readonly atlasImage: HTMLImageElement
  readonly shaderLayout: ShaderLayout
}
