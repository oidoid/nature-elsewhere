export type Assets = {[T in AssetURL]: Asset}
export type AssetURL = ImageURL
export type Asset = ImageAsset

export enum ImageURL {
  POND = '/assets/textures/pond.png',
  REFLECTIONS = '/assets/textures/reflections.png',
  WATER = '/assets/textures/water.png'
}
export interface ImageAsset {
  url: ImageURL
  image: HTMLImageElement
}

export function load(imageURLs: ImageURL[]): Promise<Assets> {
  return loadImages(imageURLs).then(assets =>
    Object.assign({}, ...assets.map(asset => ({[asset.url]: asset})))
  )
}

function loadImages(urls: ImageURL[]): Promise<ImageAsset[]> {
  return Promise.all(urls.map(url => loadImage(url)))
}

function loadImage(url: ImageURL): Promise<ImageAsset> {
  const image = new Image()
  return new Promise((resolve, reject) => {
    image.onload = () => resolve({url, image})
    image.onerror = () => reject({url, image})
    image.src = url
  }) // todo: .cancel(() => { image.src = undefined }})
}
