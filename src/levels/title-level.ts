import {AnimationID} from '../images/animation-id'
import {Atlas} from '../images/atlas'
import {Image} from '../images/image'
import {ImageGroup} from '../images/image-group'
import {LevelDefault} from './level-default'
import {MemFont} from '../text/mem-font'
import {Store} from '../store/store'
import {Text} from '../text/text'
import {Viewport} from '../graphics/viewport'

export class TitleLevel implements Level {
  private readonly _store: Store
  private readonly _footer: ImageGroup
  constructor(
    shaderLayout: ShaderLayout,
    private readonly atlas: Atlas.Definition
  ) {
    this._store = new Store(shaderLayout, atlas)

    const {date, version, hash} = process.env
    this._footer = new ImageGroup(
      atlas,
      Text.toImages(`${date} v${version} (${hash})`)
    )

    this._store.addImages(
      Image.new(AnimationID.BACKGROUND),
      ...this._footer.images()
    )
  }

  scale(canvas: WH): number {
    return Viewport.scale(canvas, LevelDefault.minScreenSize, 0)
  }

  update(time: number, _canvas: Rect, cam: Rect): LevelUpdate {
    this._footer.moveTo({x: cam.x + 1, y: cam.y + cam.h - MemFont.lineHeight})
    return {nextLevel: this, ...this._store.update(this.atlas, time, cam)}
  }
}
