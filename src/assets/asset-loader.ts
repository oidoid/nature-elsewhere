export type Assets<T, ID extends keyof T = keyof T> = {
  readonly [URL in T[ID] & string]: Asset<ID, URL>
}
export type Asset<ID, URL> = TextureAsset<ID, URL>

export interface TextureAsset<ID, URL> {
  id: ID & string
  url: URL & string
  image: HTMLImageElement
}
export type URLMap<T> = {[ID in keyof T]: T[ID]}

export function load<T extends URLMap<T>>(textures: T): Promise<Assets<T>> {
  return loadTextures(textures).then(assets =>
    Object.assign({}, ...assets.map(asset => ({[asset.url]: asset})))
  )
}

function loadTextures<T>(
  urls: URLMap<T>
): Promise<TextureAsset<string, T[keyof T]>[]> {
  const promises = Object.entries(urls).map(([id, url]) => loadTexture(id, url))
  return Promise.all(promises)
}

function loadTexture<ID, URL>(
  id: ID & string,
  url: URL & string
): Promise<TextureAsset<ID, URL>> {
  const image = new Image()
  return new Promise((resolve, reject) => {
    image.onload = () => resolve({id, url, image})
    image.onerror = () => reject({id, url, image})
    image.src = url
  }) // todo: .cancel(() => { image.src = undefined }})
}
