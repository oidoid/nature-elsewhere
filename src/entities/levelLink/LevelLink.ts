import {AtlasID} from '../../atlas/AtlasID'
import {CollisionPredicate} from '../../collision/CollisionPredicate'
import {EntitySerializer} from '../../entity/EntitySerializer'
import {EntityType} from '../../entity/EntityType'
import {Input} from '../../inputs/Input'
import {JSONObject} from '../../utils/JSON'
import {Level} from '../../levels/Level'
import {LevelAdvance} from '../../levels/LevelAdvance'
import {LevelType} from '../../levels/LevelType'
import {Text} from '../text/Text'
import {UpdateState} from '../../updaters/UpdateState'
import {UpdateStatus} from '../../updaters/UpdateStatus'

export class LevelLink extends Text {
  private _link?: LevelType
  constructor(props?: LevelLink.Props) {
    super({...defaults, ...props})
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
    status |= this.setConstituentID(color)

    if (!collision || !Input.inactiveTriggered(state.inputs.pick)) return status

    if (this.link === LevelType.BACK) state.level.advance = LevelAdvance.PREV
    else Level.advance(state.level, this.link)
    return status | UpdateStatus.UPDATED | UpdateStatus.TERMINATE
  }

  toJSON(): JSONObject {
    const diff = EntitySerializer.serialize(this, defaults)
    if (this._link) diff.link = this._link
    return diff
  }
}

export namespace LevelLink {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    NONE = 'none'
  }

  export interface Props
    extends Text.Props<LevelLink.Variant, LevelLink.State> {
    readonly link?: LevelType
  }
}

const defaults = Object.freeze({
  type: EntityType.UI_LEVEL_LINK,
  variant: LevelLink.Variant.NONE,
  state: LevelLink.State.NONE,
  collisionPredicate: CollisionPredicate.BOUNDS
})
