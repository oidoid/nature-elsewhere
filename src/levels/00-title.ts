import * as autoscale from '../graphics/screen'
import * as limits from '../math/limits'
import * as number from '../utils/number'
import * as text from '../text/text'
import {AnimationID} from '../images/animation-id'
import {AtlasDefinition} from '../images/atlas-definition'
import {Fields} from './01-fields'
import {Image} from '../images/image'
import {ImageGroup} from '../images/image-group'
import {newLogo} from '../entities/logo'
import {Palette} from '../images/palette'
import {Recorder} from '../inputs/recorder'
import {Store} from '../entities/store'

export class Title implements Level {
  private readonly _store: Store
  private readonly _logo: ImageGroup
  private readonly _footer: ImageGroup
  private readonly _cursor: Image
  private readonly _cursorReference: Image
  private _cursorState: Select = Select.START
  constructor(
    private readonly _atlas: AtlasDefinition,
    private readonly _recorder: Recorder
  ) {
    this._store = new Store(_atlas)
    let logo = newLogo(_atlas, 1, {x: 0, y: 6})
    const chars = text.toImages(_atlas, 'episode 0                rndmem')
    Image.setPalette(Palette.ALTERNATE, chars)
    Image.moveBy(
      {x: 0, y: Image.target(logo).y + Image.target(logo).h + 3},
      chars
    )
    logo = logo.concat(chars)

    const menuText = `
> start
  level editor
  exit
    `.trim()
    const menuChars = text.toImages(_atlas, menuText)
    this._cursor = menuChars[0]
    this._cursorReference = menuChars[1]
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
      _atlas,
      `${process.env.date}  v${process.env.version} (${process.env.hash})`
    )
    this._footer = new ImageGroup(footer)
    this._footer.setPalette(Palette.ALTERNATE)

    this._store.addImages(
      Image.new(_atlas, AnimationID.PALETTE_PALE, {preScale: limits.MAX_XY}),
      ...this._logo.images()
    )
    this._store.addImages(...footer)
  }

  scale(canvas: WH) {
    return autoscale.scale(canvas, {w: 105, h: 81})
  }

  update(then: number, now: number, cam: Rect): LevelUpdate {
    let nextLevel: Level | undefined = this
    this._logo.centerOn(cam)
    this._footer.moveTo({x: cam.x + 1, y: cam.y + cam.h - 5})
    if (this._recorder.down(true)) {
      this._cursorState = number.wrap(
        this._cursorState + 1,
        Select.START,
        Select.END + 1
      )
    }
    if (this._recorder.up(true)) {
      this._cursorState = number.wrap(
        this._cursorState - 1,
        Select.START,
        Select.END + 1
      )
    }
    if (this._recorder.action(true)) {
      switch (this._cursorState) {
        case Select.START:
          nextLevel = new Fields(this._atlas)
          break
        case Select.EXIT:
          nextLevel = undefined
          break
      }
    }
    this._cursor.moveTo({
      x: this._cursor.target().x,
      y: this._cursorReference.target().y + this._cursorState * 5
    })
    return {nextLevel, ...this._store.update(now - then, cam)}
  }
}

enum Select {
  START = 0,
  LEVEL_EDITOR = 1,
  EXIT = 2,
  END = EXIT
}
