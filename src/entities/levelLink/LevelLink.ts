import {Atlas} from 'aseprite-atlas'
import {AtlasID} from '../../atlas/AtlasID'
import {CollisionPredicate} from '../../collision/CollisionPredicate'
import {EntityType} from '../../entity/EntityType'
import {Input} from '../../inputs/Input'
import {JSONObject} from '../../utils/JSON'
import {Level} from '../../levels/Level'
import {LevelType} from '../../levels/LevelType'
import {ObjectUtil} from '../../utils/ObjectUtil'
import {Text} from '../text/Text'
import {UpdateState} from '../../updaters/UpdateState'
import {UpdateStatus} from '../../updaters/updateStatus/UpdateStatus'
import {LevelAdvance} from '../../levels/LevelAdvance'

export class LevelLink extends Text {
  private _link?: LevelType
  constructor(atlas: Atlas, props?: LevelLink.Props) {
    super(atlas, {...defaults, ...props})
    this._link = props ? props.link : undefined
  }

  get link(): Maybe<LevelType> {
    return this._link
  }

  update(state: UpdateState): UpdateStatus {
    let status = UpdateStatus.UNCHANGED
    if (!this.link) return status

    const collision = Level.collisionWithCursor(state.level, this)
    const color = collision ? AtlasID.PALETTE_BLACK : AtlasID.PALETTE_GREY
    status |= this.setImageID(color)

    if (!collision || !Input.inactiveTriggered(state.inputs.pick)) return status

    if (this.link === LevelType.UI_BACK) state.level.advance = LevelAdvance.PREV
    else Level.advance(state.level, this.link)
    return status | UpdateStatus.UPDATED | UpdateStatus.TERMINATE
  }

  toJSON(): JSONObject {
    const diff = super._toJSON(defaults)
    if (this._link) diff.link = this._link
    return diff
  }
}

export namespace LevelLink {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }

  export interface Props
    extends Text.Props<LevelLink.Variant, LevelLink.State> {
    readonly link?: LevelType
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.UI_LEVEL_LINK,
  variant: LevelLink.Variant.NONE,
  state: LevelLink.State.VISIBLE,
  collisionPredicate: CollisionPredicate.BOUNDS
})
