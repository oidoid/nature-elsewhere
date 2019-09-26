import {Atlas} from '../atlas/Atlas'
import {ShaderLayout} from '../renderer/ShaderLayout'

export interface Assets {
  readonly atlas: Atlas
  readonly atlasImage: HTMLImageElement
  readonly shaderLayout: ShaderLayout
}
