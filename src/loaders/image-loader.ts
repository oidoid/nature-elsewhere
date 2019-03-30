export namespace ImageLoader {
  export function loadImages(
    ...urls: readonly string[]
  ): Promise<readonly HTMLImageElement[]> {
    return Promise.all(urls.map(url => loadImage(url)))
  }

  export function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = url
    })
  }
}
