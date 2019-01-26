import * as limits from '../math/limits'
import * as text from '../text/text'
import {AnimationID} from '../images/animation-id'
import {AtlasDefinition} from '../images/atlas-definition'
import {newImage} from '../images/image'
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
    this.logo = newImage(atlas, AnimationID.NATURE_ELSEWHERE, 2, {x: 0, y: 0})
    this.twinkle = newImage(
      atlas,
      AnimationID.RAIN,
      1,
      {x: 0, y: 0},
      {
        wh: atlas.animations[AnimationID.NATURE_ELSEWHERE].size,
        maskAnimationID: AnimationID.NATURE_ELSEWHERE,
        palette: Palette.ALTERNATE
      }
    )
    const images = [
      newImage(
        atlas,
        AnimationID.PALETTE_PALE,
        0,
        {x: 0, y: 0},
        {prescale: limits.MAX_XY}
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
    centerOnCam(cam, this.logo)
    follow(this.twinkle, this.logo)
    // this.twinkle.cel = random this.atlas.animations[this.twinkle.animationID].cels.length
    this.twinkle.offset.y -= 0.05 * this.random.float()
    // if any input, nextLevel = fields
    const nextLevel = this
    return {nextLevel, ...this.store.update(now - then)}
  }
}

function follow(image: Image, {target}: Image): void {
  image.target.x = target.x
  image.target.y = target.y
}

function centerOnCam(cam: Rect, image: Image): void {
  image.target.x = cam.x + cam.w / 2 - image.target.w / 2
  image.target.y = cam.y + cam.h / 2 - image.target.h / 2
}
