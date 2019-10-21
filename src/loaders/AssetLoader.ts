import * as atlasJSON from '../atlas/atlas.json'
import * as shaderLayoutConfig from '../renderer/shaderLayoutConfig.json'
import {Assets} from './Assets'
import {ImageLoader} from './ImageLoader'
import {Parser} from 'aseprite-atlas'
import {ShaderLayoutParser} from '../renderer/ShaderLayoutParser'

export namespace AssetLoader {
  export const load = async (): Promise<Assets> => {
    const atlasImage = await ImageLoader.load('/atlas/atlas.png')
    const shaderLayout = ShaderLayoutParser.parse(shaderLayoutConfig)
    return {atlas: Parser.parse(atlasJSON), atlasImage, shaderLayout}
  }
}
