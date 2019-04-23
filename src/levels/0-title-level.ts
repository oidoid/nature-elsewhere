import * as strings from '../assets/strings.json'
import {AnimationID} from '../images/animation-id'
import {Atlas} from '../images/atlas'
import {LevelDefault} from './level-default'
import {FieldsLevel} from './1-fields-level'
import {Image} from '../images/image'
import {ImageGroup} from '../images/image-group'
import {InputBit} from '../inputs/input-bit'
import {Limits} from '../math/limits'
import {MemFont} from '../text/mem-font'
import {NatureElsewhere} from '../entities/nature-elsewhere'
import {NumberUtil} from '../utils/number-util'
import {Palette, Tone} from '../images/palette'
import {RainCloud} from '../entities/rain-cloud'
import {Random} from '../math/random.js'
import {Recorder} from '../inputs/recorder'
import {SettingsLevel} from './settings-level'
import {Store} from '../entities/store'
import {Text} from '../text/text'
import {Viewport} from '../graphics/viewport'
import {VirtualJoystick} from '../entities/ui/virtual-joystick'

enum Select {
  START,
  SETTINGS,
  LEVEL_EDITOR,
  EXIT,
  END
}

const rowHeight: number = MemFont.lineHeight + MemFont.leading

export class TitleLevel implements Level {
  private readonly _store: Store
  private readonly _logo: ImageGroup
  private readonly _footer: ImageGroup
  private readonly _cursor: Image
  private readonly _cursorReference: Image
  private _cursorRow: Select = Select.START
  private readonly _virtualJoystick: VirtualJoystick
  constructor(
    private readonly _atlas: Atlas.Definition,
    private readonly _recorder: Recorder,
    private readonly _random: Random
  ) {
    this._store = new Store(_atlas)
    let logo = NatureElsewhere.create(_atlas, 1, {x: 0, y: 6})
    const chars = Text.toImages(
      _atlas,
      `${strings['ui/title/episode-0']}                ${
        strings['ui/title/rndmem']
      }`
    )
    Image.setPalette(Palette.GREYS + Tone.HALF, chars)
    Image.moveBy(
      {x: 0, y: Image.target(logo).y + Image.target(logo).h + 3},
      chars
    )
    logo = logo.concat(chars)

    const menuText = `
> ${strings['ui/title/menu/start']}
  ${strings['ui/title/menu/settings']}
  ${strings['ui/title/menu/level-editor']}
  ${strings['ui/title/menu/exit']}
    `.trim()
    const menuChars = Text.toImages(_atlas, menuText)
    this._cursor = menuChars[0]
    this._cursorReference = menuChars[1]
    Image.moveBy(
      {
        x:
          Math.trunc(Image.target(logo).x + Image.target(logo).w / 2) -
          Math.trunc(Image.target(menuChars).w / 2 + 3),
        y: Image.target(logo).y + Image.target(logo).h + 6
      },
      menuChars
    )
    logo = logo.concat(menuChars)
    this._logo = new ImageGroup(logo)

    this._footer = new ImageGroup(
      Text.toImages(
        _atlas,
        `${process.env.date}  v${process.env.version} (${process.env.hash})`
      )
    )
    this._footer.setPalette(Palette.GREYS + Tone.HALF)

    this._store.addImages(
      Image.new(_atlas, AnimationID.PIXEL, {
        palette: Palette.YELLOWS,
        preScale: Limits.MAX_XY
      }),
      ...this._logo.images(),
      ...this._footer.images(),
      ...Image.moveBy(
        {x: 105 + 10 - 40, y: 2},
        RainCloud.create(
          _atlas,
          AnimationID.CLOUD_M,
          3,
          {x: 1, y: 100},
          {x: 0, y: -0.004}
        )
      ),
      ...Image.moveBy(
        {x: 65 + 10 - 40, y: 22},
        RainCloud.create(
          _atlas,
          AnimationID.CLOUD_S,
          3,
          {x: 1, y: 100},
          {x: 0, y: -0.004}
        )
      ),
      ...Image.moveBy(
        {x: 120 + 10 - 40, y: 36},
        RainCloud.create(
          _atlas,
          AnimationID.CLOUD_XL,
          3,
          {x: 1, y: 100},
          {x: 0, y: -0.004}
        )
      )
    )
    this._virtualJoystick = new VirtualJoystick(_atlas, 100)
    this._store.addImages(...this._virtualJoystick.images())
  }

  scale(canvas: WH): number {
    return Viewport.scale(canvas, LevelDefault.minScreenSize, 0)
  }

  update(then: number, now: number, _canvas: Rect, cam: Rect): LevelUpdate {
    const milliseconds = now - then
    this._virtualJoystick.update(milliseconds, this._recorder)

    let nextLevel: Level | undefined = this
    this._logo.centerOn(cam)
    this._footer.moveTo({x: cam.x + 1, y: cam.y + cam.h - rowHeight})
    if (this._recorder.triggeredSet(InputBit.DOWN)) {
      const nextState = this._cursorRow + 1
      this._cursorRow = NumberUtil.wrap(nextState, Select.START, Select.END)
    }
    if (this._recorder.triggeredSet(InputBit.UP)) {
      const nextState = this._cursorRow - 1
      this._cursorRow = NumberUtil.wrap(nextState, Select.START, Select.END)
    }
    if (this._recorder.triggeredSet(InputBit.ACTION)) {
      switch (this._cursorRow) {
        case Select.START:
          nextLevel = new FieldsLevel(this._atlas, this._recorder, this._random)
          break
        case Select.SETTINGS:
          nextLevel = new SettingsLevel(this._atlas, this._recorder, this)
          break
        case Select.EXIT:
          nextLevel = undefined
          break
      }
    }
    this._cursor.moveTo({
      x: this._cursor.target().x,
      y: this._cursorReference.target().y + this._cursorRow * rowHeight
    })
    return {nextLevel, ...this._store.update(now - then, cam)}
  }
}
