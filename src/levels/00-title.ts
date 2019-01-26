import * as limits from '../math/limits'
import * as text from '../text/text'
import {AnimationID} from '../images/animation-id'
import {AtlasDefinition} from '../images/atlas-definition'
import {Image} from '../images/image'
import {Store} from '../store'
import {Palette} from '../images/palette'
import {Random} from '../math/random'

export class Title implements Level {
  private random: Random
  private store: Store
  private logo: Image
  private twinkle: Image
  constructor(atlas: AtlasDefinition, random: Random) {
    this.random = random
    this.store = new Store(atlas)
    this.logo = Image.new(atlas, AnimationID.NATURE_ELSEWHERE, 2, {x: 0, y: 0})
    this.twinkle = Image.new(
      atlas,
      AnimationID.RAIN,
      1,
      {x: 0, y: 0},
      {
        maskAnimationID: AnimationID.NATURE_ELSEWHERE,
        palette: Palette.ALTERNATE
      }
    )
    const images = [
      Image.new(
        atlas,
        AnimationID.PALETTE_PALE,
        0,
        {x: 0, y: 0},
        {preScale: limits.MAX_XY}
      ),
      this.twinkle,
      this.logo,
      ...text.toImages(atlas, 'episode 0', 0, {
        x: 10,
        y: 10, // this needs to be on a layer group thingy. this could be a translate attribute that only manifests for groups at render time.
        w: 50,
        h: 30 // need a palette shift
      })
    ]
    this.store.addImages(...images)
  }

  update(then: number, now: number, cam: Rect) {
    this.logo.centerOn(cam)
    this.twinkle.moveTo(this.logo.target())
    this.twinkle.addOffset({x: 0, y: -0.05 * this.random.float()})
    // this.twinkle.cel = random this.atlas.animations[this.twinkle.animationID].cels.length
    // if any input, nextLevel = fields
    return {nextLevel: this, ...this.store.update(now - then)}
  }
}
