import {Game} from './game.js'

Promise.all([
  loadImage('/assets/atlas.png'),
  loadImage('/assets/palettes.png')
]).then(([atlas, palettes]) => {
  const canvas = document.querySelector('canvas')
  if (!canvas) throw new Error('Canvas missing.')

  const game = new Game(window, canvas, atlas, palettes)
  game.bind()
  game.start()
})

/**
 * @arg {string} url
 * @return {Promise<HTMLImageElement>}
 */
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = url
  })
}
