import {Assets} from './assets'
import * as atlasJSON from '../assets/atlas/atlas.json'
import {AtlasParser} from '../atlas/atlas-parser'
import {ImageLoader} from './image-loader'
import * as shaderLayoutConfig from '../graphics/shaders/shader-layout-config.json'
import {ShaderLayoutParser} from '../graphics/shaders/shader-layout-parser'

export namespace AssetLoader {
  export const load = async (): Promise<Assets> => {
    const atlasImage = await ImageLoader.load('/assets/atlas/atlas.png')
    const shaderLayout = ShaderLayoutParser.parse(shaderLayoutConfig)
    return {atlas: AtlasParser.parse(atlasJSON), atlasImage, shaderLayout}
  }
}
