import {Atlas} from 'aseprite-atlas'
import {CollisionPredicate} from '../collision/CollisionPredicate'
import {CollisionType} from '../collision/CollisionType'
import {DownloadUtil} from '../storage/DownloadUtil'
import {Entity} from '../entity/Entity'
import {EntityID} from '../entity/EntityID'
import {EntitySerializer} from '../entity/EntitySerializer'
import {EntityType} from '../entity/EntityType'
import {FollowCam, FollowCamOrientation} from '../updaters/followCam/FollowCam'
import {FollowCamUpdater} from '../updaters/followCam/FollowCamUpdater'
import {ImageRect} from '../imageStateMachine/ImageRect'
import {JSONValue} from '../utils/JSON'
import {LevelEditorSandbox} from './LevelEditorSandbox'
import {LevelLink} from './levelLink/LevelLink'
import {LevelType} from '../levels/LevelType'
import {LocalStorage} from '../storage/LocalStorage'
import {ObjectUtil} from '../utils/ObjectUtil'
import {reaullyLoadTheStuff} from './levelEditorPanel/LevelEditorPanel'
import {UpdatePredicate} from '../updaters/updatePredicate/UpdatePredicate'
import {UpdateState} from '../updaters/UpdateState'
import {UpdateStatus} from '../updaters/updateStatus/UpdateStatus'
import {WH} from '../math/WH'
import {XY} from '../math/XY'

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
      LevelType.BACK
    )
    this._import = newLink(
      atlas,
      EntityID.UI_LEVEL_EDITOR_MENU_IMPORT,
      new XY(0, 6),
      'import level', // [strings]
      LevelType.BACK
    )
    this._reset = newLink(
      atlas,
      EntityID.UI_LEVEL_EDITOR_MENU_RESET,
      new XY(0, 12),
      'reset level',
      LevelType.BACK
    )
    this._backToTitle = newLink(
      atlas,
      EntityID.UI_LEVEL_EDITOR_MENU_BACK_TO_TITLE,
      new XY(0, 18),
      'back to title', // [strings]
      LevelType.TITLE
    )
    this._backToEditor = newLink(
      atlas,
      EntityID.UI_LEVEL_EDITOR_MENU_BACK_TO_EDITOR,
      new XY(0, 24),
      'back to level editor', // [strings]
      LevelType.BACK
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
            DownloadUtil.downloadString(
              state.win.document,
              'level.json',
              LocalStorage.get(
                LocalStorage.Key.LEVEL_EDITOR_SANDBOX_AUTO_SAVE
              ) || '[]',
              'application/json'
            )
            break
          case EntityID.UI_LEVEL_EDITOR_MENU_IMPORT:
            DownloadUtil.uploadString(
              state.win.document,
              'application/json'
            ).then(({data}) => {
              const sandbox =
                state.level.prevLevel &&
                Entity.findAnyByID(
                  state.level.prevLevel.parentEntities,
                  EntityID.UI_LEVEL_EDITOR_SANDBOX
                )
              if (sandbox) {
                sandbox.clearChildren()
                reaullyLoadTheStuff(
                  state.level.atlas,
                  <LevelEditorSandbox>sandbox,
                  data
                )
              }
            })
            break
          case EntityID.UI_LEVEL_EDITOR_MENU_RESET:
            LocalStorage.put(
              LocalStorage.Key.LEVEL_EDITOR_SANDBOX_AUTO_SAVE,
              undefined
            )
            if (state.level.prevLevel) {
              const sandbox = Entity.findAnyByID(
                state.level.prevLevel.parentEntities,
                EntityID.UI_LEVEL_EDITOR_SANDBOX
              )
              if (sandbox) sandbox.clearChildren()
            }
            break
        }
      }
      status |= childStatus
    }

    return status
  }

  toJSON(): JSONValue {
    return EntitySerializer.serialize(this, defaults)
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
  type: EntityType.UI_LEVEL_EDITOR_MENU,
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
