import {entries} from '../util'

export type AssetID = TextureAssetID
export enum TextureAssetID {
  ATLAS
}

export type Assets = Readonly<Record<AssetID, Asset>>

export type Asset = HTMLImageElement

export type URLMap = Readonly<Record<AssetID, string>>

export function load(textureURLs: URLMap): Promise<Assets> {
  return loadTextureAssets(textureURLs)
}

function loadTextureAssets(urls: URLMap): Promise<Assets> {
  return Promise.all(
    entries(urls).map(([id, url]) => loadTextureAsset(id, url))
  ).then(assets => Object.assign({}, ...assets))
}

function loadTextureAsset(id: AssetID, url: string): Promise<Assets> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve({[id]: image})
    image.onerror = reject
    image.src = url
  })
}
