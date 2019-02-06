import * as limits from '../math/limits'
import * as text from '../text/text'
import {AnimationID} from '../images/animation-id'
import {AtlasDefinition} from '../images/atlas-definition'
import {Image} from '../images/image'
import {ImageGroup} from '../images/image-group'
import {Palette} from '../images/palette'
import {Store} from '../entities/store'
import {newLogo} from '../entities/logo'

export class Title implements Level {
  private readonly _scale: number = 9
  private readonly _store: Store
  private readonly _logo: ImageGroup
  private readonly _footer: ImageGroup
  constructor(atlas: AtlasDefinition) {
    this._store = new Store(atlas)
    let logo = newLogo(atlas, 1, {x: 0, y: 6})
    const chars = text.toImages(atlas, 'episode 0                rndmem')
    Image.setPalette(Palette.ALTERNATE, chars)
    Image.moveBy(
      {x: 0, y: Image.target(logo).y + Image.target(logo).h + 3},
      chars
    )
    logo = logo.concat(chars)

    const menuText = `
> start
  level editor
  settings
  exit
    `.trim()
    const menuChars = text.toImages(atlas, menuText)
    Image.moveBy(
      {
        x:
          Image.target(logo).x +
          Image.target(logo).w / 2 -
          Image.target(menuChars).w / 2 +
          3,
        y: Image.target(logo).y + Image.target(logo).h + 6
      },
      menuChars
    )
    logo = logo.concat(menuChars)
    this._logo = new ImageGroup(logo)

    const footer = text.toImages(
      atlas,
      `${process.env.date}  v${process.env.version} (${process.env.hash})`
    )
    this._footer = new ImageGroup(footer)
    this._footer.setPalette(Palette.ALTERNATE)

    this._store.addImages(
      Image.new(atlas, AnimationID.PALETTE_PALE, {preScale: limits.MAX_XY}),
      ...this._logo.images()
    )
    this._store.addImages(...footer)
  }

  scale() {
    return this._scale
  }

  update(then: number, now: number, cam: Rect): LevelUpdate {
    this._logo.centerOn(cam)
    this._footer.moveTo({x: cam.x + 1, y: cam.y + cam.h - 5})
    // pass recorder in here or do i have my own recorder?
    // restore context when hidden is broken
    // if any input, nextLevel = fields
    return {nextLevel: this, ...this._store.update(now - then, cam)}
  }
}
