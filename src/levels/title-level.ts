import {AnimationID} from '../images/animation-id'
import * as Atlas from '../atlas/atlas'
import * as Image from '../images/image'
import * as ImageSystem from '../images/image-system'
import * as LevelDefault from './level-default'
import * as MemFont from '../text/mem-font'
import * as Store from '../store/store'
import * as Text from '../text/text'
import * as Viewport from '../graphics/viewport'

export class TitleLevel implements Level {
  private store: Store.State
  private text: ImageSystem
  private images: readonly Image[]
  constructor(shaderLayout: ShaderLayout, atlas: Atlas.State) {
    this.store = Store.make(shaderLayout, atlas)
    const {date, version, hash} = process.env
    const images = Text.toImages(`${date} v${version} (${hash})`)
    this.text = {origin: {x: 0, y: 0}, images}

    this.images = (<Image[]>[]).concat(
      Image.make(AnimationID.BACKGROUND),
      ...this.text.images
    )
  }

  scale(canvas: WH): number {
    return Viewport.scale(canvas, LevelDefault.minScreenSize, 0)
  }

  update(time: number, _canvas: Rect, cam: Rect): LevelUpdate {
    const target = {x: cam.x + 1, y: cam.y + cam.h - MemFont.lineHeight}
    this.text = ImageSystem.moveTo(
      this.text.origin,
      target,
      ...this.text.images
    )
    this.store = Store.update(this.store, cam, this.images, time)
    return {nextLevel: this, dat: this.store.dat, len: this.store.len}
  }
}
