export type Assets = {[url: string]: Asset}
export type Asset = ImageAsset

export interface ImageAsset {
  url: string
  image: HTMLImageElement
}

export function load(imageURLs: string[]): Promise<Assets> {
  return loadImages(imageURLs).then(assets =>
    Object.assign({}, ...assets.map(asset => ({[asset.url]: asset})))
  )
}

function loadImages(urls: string[]): Promise<ImageAsset[]> {
  return Promise.all(urls.map(url => loadImage(url)))
}

function loadImage(url: string): Promise<ImageAsset> {
  const image = new Image()
  return new Promise((resolve, reject) => {
    image.onload = () => resolve({url, image})
    image.onerror = () => reject({url, image})
    image.src = url
  }) // todo: .cancel(() => { image.src = undefined }})
}
