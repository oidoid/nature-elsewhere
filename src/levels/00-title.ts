import * as limits from '../math/limits'
import * as text from '../text/text'
import {AnimationID} from '../images/animation-id'
import {AtlasDefinition} from '../images/atlas-definition'
import {Image} from '../images/image'
import {ImageGroup} from '../images/image-group'
import {Palette} from '../images/palette'
import {Random} from '../math/random'
import {Store} from '../entities/store'

export class Title implements Level {
  private readonly _store: Store
  private readonly _logo: Image
  private readonly _twinkle: Image
  private readonly _chars: ImageGroup
  constructor(atlas: AtlasDefinition, private readonly _random: Random) {
    this._random = _random
    this._store = new Store(atlas)
    this._logo = Image.new(atlas, AnimationID.NATURE_ELSEWHERE, 2, {x: 0, y: 0})
    console.log(this._random)
    this._twinkle = Image.new(
      atlas,
      AnimationID.RAIN,
      1,
      {x: 0, y: 0},
      {
        offsetRate: {x: 0, y: -0.0005},
        maskAnimationID: AnimationID.NATURE_ELSEWHERE,
        palette: Palette.ALTERNATE
      }
    )
    const chars = text.toImages(atlas, 'episode 0', 0, {
      x: 0,
      y: 0,
      w: 300,
      h: 1 // need a palette shift
    })
    this._chars = new ImageGroup(chars)
    const images = [
      Image.new(
        atlas,
        AnimationID.PALETTE_PALE,
        0,
        {x: 0, y: 0},
        {preScale: limits.MAX_XY}
      ),
      this._twinkle,
      this._logo,
      ...chars
    ]
    this._store.addImages(...images)
  }

  update(then: number, now: number, cam: Rect): LevelUpdate {
    this._logo.centerOn(cam)
    this._twinkle.moveTo(this._logo.target())
    const target = {
      x: Math.trunc(
        this._logo.target().x +
          (this._logo.target().w - this._chars.target().w) / 2
      ),
      y: this._logo.target().y + this._logo.target().h + 2
    }
    this._chars.moveTo(target)
    // pass recorder in here or do i have my own recorder?
    // restore context when hidden is broken
    // if any input, nextLevel = fields
    return {nextLevel: this, ...this._store.update(now - then, cam)}
  }
}
