import * as memFont from '../../text/memFont.json'
import * as strings from '../../utils/strings.json'
import {CollisionPredicate} from '../../collision/CollisionPredicate'
import {CollisionType} from '../../collision/CollisionType'
import {Entity} from '../../entity/Entity'
import {EntityID} from '../../entity/EntityID'
import {EntitySerializer} from '../../entity/EntitySerializer'
import {EntityType} from '../../entity/EntityType'
import {FilePrompt} from '../../storage/FilePrompt'
import {FollowCam, ReadonlyFollowCam} from '../../updaters/FollowCam'
import {JSONValue} from '../../utils/JSON'
import {LevelEditorSandbox} from './LevelEditorSandbox'
import {LevelEditorSandboxFileUtil} from './LevelEditorSandboxFileUtil'
import {LevelLink} from '../levelLink/LevelLink'
import {LevelType} from '../../levels/LevelType'
import {LocalStorage} from '../../storage/LocalStorage'
import {Marquee} from '../Marquee'
import {SpriteRect} from '../../spriteStateMachine/SpriteRect'
import {UpdatePredicate} from '../../updaters/UpdatePredicate'
import {UpdateState} from '../../updaters/UpdateState'
import {UpdateStatus} from '../../updaters/UpdateStatus'
import {WH} from '../../math/WH'
import {XY} from '../../math/XY'

export class LevelEditorMenu extends Entity<
  LevelEditorMenu.Variant,
  LevelEditorMenu.State
> {
  private readonly _followCam: ReadonlyFollowCam
  private readonly _export: LevelLink
  private readonly _import: LevelLink
  private readonly _reset: LevelLink
  private readonly _restore: LevelLink
  private readonly _backToTitle: LevelLink
  private readonly _backToEditor: LevelLink

  constructor(
    props?: Entity.SubProps<LevelEditorMenu.Variant, LevelEditorMenu.State>
  ) {
    super({
      ...defaults,
      map: {
        [LevelEditorMenu.State.VISIBLE]: new SpriteRect()
      },
      ...props
    })

    this._followCam = Object.freeze({
      positionRelativeToCam: FollowCam.Orientation.CENTER,
      camMargin: Object.freeze(new WH(0, 0))
    })
    this._export = newLink(
      EntityID.UI_LEVEL_EDITOR_MENU_EXPORT,
      new XY(0, 0 * memFont.lineHeight),
      strings['levelEditor/export'],
      LevelType.BACK
    )
    this._import = newLink(
      EntityID.UI_LEVEL_EDITOR_MENU_IMPORT,
      new XY(0, 1 * memFont.lineHeight),
      strings['levelEditor/import'],
      LevelType.BACK
    )
    this._reset = newLink(
      EntityID.UI_LEVEL_EDITOR_MENU_RESET,
      new XY(0, 2 * memFont.lineHeight),
      strings['levelEditor/reset'],
      LevelType.BACK
    )
    this._restore = newLink(
      EntityID.UI_LEVEL_EDITOR_MENU_RESTORE_BACKUP,
      new XY(0, 3 * memFont.lineHeight),
      strings['levelEditor/restore'],
      LevelType.BACK
    )
    this._backToTitle = newLink(
      EntityID.UI_LEVEL_EDITOR_MENU_BACK_TO_TITLE,
      new XY(0, 5 * memFont.lineHeight),
      strings['backToTitle'],
      LevelType.TITLE
    )
    this._backToEditor = newLink(
      EntityID.UI_LEVEL_EDITOR_MENU_BACK_TO_EDITOR,
      new XY(0, 6 * memFont.lineHeight),
      strings['levelEditor/backToEditor'],
      LevelType.BACK
    )

    this.addChildren(
      this._export,
      this._import,
      this._reset,
      this._restore,
      this._backToTitle,
      this._backToEditor
    )
  }

  update(state: UpdateState): UpdateStatus {
    let status =
      super.update(state) | FollowCam.update(this._followCam, this, state)

    for (const child of this.children) {
      const childStatus = child.update(state)
      if (child instanceof LevelLink && childStatus & UpdateStatus.TERMINATE) {
        switch (child.id) {
          case EntityID.UI_LEVEL_EDITOR_MENU_EXPORT:
            exportLevel(state)
            break
          case EntityID.UI_LEVEL_EDITOR_MENU_IMPORT:
            importLevel(state)
            break
          case EntityID.UI_LEVEL_EDITOR_MENU_RESET:
            resetLevel(state)
            break
          case EntityID.UI_LEVEL_EDITOR_MENU_RESTORE_BACKUP:
            restoreBackup(state)
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

function exportLevel(state: UpdateState): void {
  FilePrompt.downloadString(
    state.win.document,
    'level.json',
    LocalStorage.get(LocalStorage.Key.LEVEL_EDITOR_SANDBOX_AUTO_SAVE) ?? '[]',
    'application/json'
  )
}

function importLevel(state: UpdateState): void {
  FilePrompt.uploadString(state.win.document, 'application/json').then(
    ({data}) => {
      const sandbox = state.level.prevLevel && state.level.prevLevel.sandbox
      if (data && sandbox) {
        replaceBackupWithAutoSave()
        resetSandbox(sandbox, state)
        LevelEditorSandboxFileUtil.load(state.level.atlas, sandbox, data)
      }
    }
  )
}

function resetLevel(state: UpdateState): void {
  replaceBackupWithAutoSave()
  const sandbox = state.level.prevLevel && state.level.prevLevel.sandbox
  if (sandbox) resetSandbox(sandbox, state)
}

function restoreBackup(state: UpdateState): void {
  const backup = LocalStorage.get(LocalStorage.Key.LEVEL_EDITOR_SANDBOX_BACK_UP)
  const sandbox = state.level.prevLevel && state.level.prevLevel.sandbox
  if (backup && sandbox) {
    replaceBackupWithAutoSave()
    resetSandbox(sandbox, state)
    LevelEditorSandboxFileUtil.load(state.level.atlas, sandbox, backup)
  }
}

function replaceBackupWithAutoSave() {
  LocalStorage.put(
    LocalStorage.Key.LEVEL_EDITOR_SANDBOX_BACK_UP,
    LocalStorage.get(LocalStorage.Key.LEVEL_EDITOR_SANDBOX_AUTO_SAVE)
  )
}

function resetSandbox(sandbox: LevelEditorSandbox, state: UpdateState): void {
  const marquee = <Maybe<Marquee>>(
    (state.level.prevLevel &&
      Entity.findAnyByID(
        state.level.prevLevel.parentEntities,
        EntityID.UI_MARQUEE
      ))
  )
  if (marquee) marquee.setSelection(undefined, state.level.cursor)
  sandbox.clearChildren()
}

export namespace LevelEditorMenu {
  export enum Variant {
    NONE = 'none'
  }

  export enum State {
    VISIBLE = 'visible'
  }
}

const defaults = Object.freeze({
  type: EntityType.UI_LEVEL_EDITOR_MENU,
  variant: LevelEditorMenu.Variant.NONE,
  updatePredicate: UpdatePredicate.ALWAYS,
  collisionPredicate: CollisionPredicate.CHILDREN,
  collisionType: CollisionType.TYPE_UI,
  state: LevelEditorMenu.State.VISIBLE
})

function newLink(
  id: EntityID,
  position: XY,
  text: string,
  link: LevelType
): LevelLink {
  const collisionPredicate = CollisionPredicate.BOUNDS
  return new LevelLink({id, position, text, link, collisionPredicate})
}
