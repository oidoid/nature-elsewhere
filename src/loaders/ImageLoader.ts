export namespace ImageLoader {
  export function load(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(image)
      image.src = url
    })
  }
}
