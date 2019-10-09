import {Atlas} from 'aseprite-atlas'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {Entity} from '../entity/Entity'
import {EntityID} from '../entity/EntityID'
import {EntityType} from '../entity/EntityType'
import {FollowCam, FollowCamOrientation} from '../updaters/followCam/FollowCam'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSONValue} from '../utils/JSON'
import {LevelLink} from './levelLink/LevelLink'
import {LevelType} from '../levels/LevelType'
import {LocalStorage} from '../storage/LocalStorage'
import {ObjectUtil} from '../utils/ObjectUtil'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {WH} from '../math/WH'
import {XY} from '../math/XY'
import {FollowCamUpdater} from '../updaters/followCam/FollowCamUpdater'

export class LevelEditorMenu extends Entity<
  LevelEditorMenu.Variant,
  LevelEditorMenu.State
> {
  private readonly _followCam: DeepImmutable<FollowCam>
  private readonly _export: LevelLink
  private readonly _import: LevelLink
  private readonly _reset: LevelLink
  private readonly _backToTitle: LevelLink
  private readonly _backToEditor: LevelLink

  constructor(
    atlas: Atlas,
    props?: Entity.SubProps<LevelEditorMenu.Variant, LevelEditorMenu.State>
  ) {
    super({
      ...defaults,
      map: {
        [Entity.BaseState.HIDDEN]: new ImageRect(),
        [LevelEditorMenu.State.VISIBLE]: new ImageRect()
      },
      ...props
    })

    this._followCam = ObjectUtil.freeze({
      positionRelativeToCam: FollowCamOrientation.CENTER,
      camMargin: new WH(0, 0)
    })
    this._export = newLink(
      atlas,
      EntityID.UI_LEVEL_EDITOR_MENU_EXPORT,
      new XY(0, 0),
      'export level', // [strings]
      LevelType.UI_BACK
    )
    this._import = newLink(
      atlas,
      EntityID.UI_LEVEL_EDITOR_MENU_IMPORT,
      new XY(0, 6),
      'import level', // [strings]
      LevelType.UI_BACK
    )
    this._reset = newLink(
      atlas,
      EntityID.UI_LEVEL_EDITOR_MENU_RESET,
      new XY(0, 12),
      'reset level',
      LevelType.UI_BACK
    )
    this._backToTitle = newLink(
      atlas,
      EntityID.UI_LEVEL_EDITOR_MENU_BACK_TO_TITLE,
      new XY(0, 18),
      'back to title', // [strings]
      LevelType.UI_TITLE
    )
    this._backToEditor = newLink(
      atlas,
      EntityID.UI_LEVEL_EDITOR_MENU_BACK_TO_EDITOR,
      new XY(0, 24),
      'back to level editor', // [strings]
      LevelType.UI_BACK
    )

    this.addChildren(
      this._export,
      this._import,
      this._reset,
      this._backToTitle,
      this._backToEditor
    )
  }

  update(state: UpdateState): UpdateStatus {
    let status =
      super.update(state) |
      FollowCamUpdater.update(this._followCam, this, state)

    for (const child of this.children) {
      const childStatus = child.update(state)
      if (child instanceof LevelLink && childStatus & UpdateStatus.TERMINATE) {
        switch (child.id) {
          case EntityID.UI_LEVEL_EDITOR_MENU_EXPORT:
            console.log('export')
            break
          case EntityID.UI_LEVEL_EDITOR_MENU_IMPORT:
            console.log('import')
            break
          case EntityID.UI_LEVEL_EDITOR_MENU_RESET:
            LocalStorage.put(
              LocalStorage.Key.LEVEL_EDITOR_SANDBOX_AUTO_SAVE,
              undefined
            )
            break
        }
      }
      status |= childStatus
    }

    return status
  }

  toJSON(): JSONValue {
    return this._toJSON(defaults)
  }
}

export namespace LevelEditorMenu {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = ObjectUtil.freeze({
  type: EntityType.LEVEL_EDITOR_MENU,
  variant: LevelEditorMenu.Variant.NONE,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionPredicate: CollisionPredicate.CHILDREN,
  collisionType: CollisionType.TYPE_UI,
  state: LevelEditorMenu.State.VISIBLE
})

function newLink(
  atlas: Atlas,
  id: EntityID,
  position: XY,
  text: string,
  link: LevelType
): LevelLink {
  const collisionPredicate = CollisionPredicate.BOUNDS
  return new LevelLink(atlas, {
    id,
    position,
    text,
    link,
    collisionPredicate
  })
}
