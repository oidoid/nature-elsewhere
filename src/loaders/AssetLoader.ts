import {Assets} from './Assets'
import * as atlasJSON from '../atlas/atlas.json'
import {ImageLoader} from './ImageLoader'
import * as shaderLayoutConfig from '../renderer/shaderLayoutConfig.json'
import {ShaderLayoutParser} from '../renderer/ShaderLayoutParser'
import {AtlasParser} from '../atlas/AtlasParser'

export namespace AssetLoader {
  export const load = async (): Promise<Assets> => {
    const atlasImage = await ImageLoader.load('/atlas/atlas.png')
    const shaderLayout = ShaderLayoutParser.parse(shaderLayoutConfig)
    return {atlas: AtlasParser.parse(atlasJSON), atlasImage, shaderLayout}
  }
}
