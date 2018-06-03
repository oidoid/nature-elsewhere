export type Assets<ID> = {[id in ID & string]: Asset}

export type Asset = HTMLImageElement
export type ResolvedAsset<ID> = {id: ID & string; result: Asset}

export type URLMap<ID> = {[id in ID & string]: string}

export function load<ID>(textureURLs: URLMap<ID>): Promise<Assets<ID>> {
  return loadTextureAssets(textureURLs).then(assets =>
    Object.assign({}, ...assets.map(asset => ({[asset.id]: asset.result})))
  )
}

function loadTextureAssets<ID>(
  urls: URLMap<ID>
): Promise<ResolvedAsset<keyof URLMap<ID>>[]> {
  type K = keyof URLMap<ID>
  type V = URLMap<ID>[K]
  const assets = Object.entries(urls).map(([id, url]) =>
    loadTextureAsset(<K>id, <V>url)
  )
  return Promise.all(assets)
}

function loadTextureAsset<ID>(
  id: ID & string,
  url: string
): Promise<ResolvedAsset<ID>> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve({id, result: image})
    image.onerror = reject
    image.src = url
  })
}
