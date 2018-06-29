export type AssetID = TextureAssetID
export enum TextureAssetID {
  ATLAS
}

export type Assets = {readonly [id in AssetID]: Asset}

export type Asset = HTMLImageElement

export type URLMap = {readonly [id in AssetID]: string}

export function load(textureURLs: URLMap): Promise<Assets> {
  return loadTextureAssets(textureURLs)
}

function loadTextureAssets(urls: URLMap): Promise<Assets> {
  type K = keyof URLMap
  type V = URLMap[K]
  const assets = Object.entries(urls).map(([id, url]) =>
    loadTextureAsset(<K>(<any>id), <V>url)
  )
  return Promise.all(assets).then(assets => Object.assign({}, ...assets))
}

function loadTextureAsset(id: AssetID, url: string): Promise<Assets> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve({[id]: image})
    image.onerror = reject
    image.src = url
  })
}
