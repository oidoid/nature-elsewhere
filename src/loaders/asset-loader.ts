import {Assets} from './assets'
import * as atlasJSON from '../atlas/atlas-assets/atlas.json'
import {ImageLoader} from './image-loader'
import * as shaderLayoutConfig from '../graphics/shaders/shader-layout/shader-layout-config.json'
import {ShaderLayoutParser} from '../graphics/shaders/shader-layout/shader-layout-parser'
import {AtlasParser} from '../atlas/atlas/atlas-parser'

export namespace AssetLoader {
  export const load = async (): Promise<Assets> => {
    const atlasImage = await ImageLoader.load('/atlas/atlas-assets/atlas.png')
    const shaderLayout = ShaderLayoutParser.parse(shaderLayoutConfig)
    return {atlas: AtlasParser.parse(atlasJSON), atlasImage, shaderLayout}
  }
}
