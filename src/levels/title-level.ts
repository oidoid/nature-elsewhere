import {AnimationID} from '../images/animation-id'
import {Atlas} from '../images/atlas'
import * as Image from '../images/image'
import * as ImageSystem from '../images/image-system'
import {LevelDefault} from './level-default'
import {MemFont} from '../text/mem-font'
import {Store} from '../store/store'
import {Text} from '../text/text'
import {Viewport} from '../graphics/viewport'

export class TitleLevel implements Level {
  private readonly _store: Store
  private text: ImageSystem
  constructor(
    shaderLayout: ShaderLayout,
    private readonly atlas: Atlas.Definition
  ) {
    this._store = new Store(shaderLayout, atlas)

    const {date, version, hash} = process.env
    const images = Text.toImages(`${date} v${version} (${hash})`)
    this.text = {origin: {x: 0, y: 0}, images}

    this._store.addImages(
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
    return {nextLevel: this, ...this._store.update(this.atlas, time, cam)}
  }
}
