import {Atlas} from 'aseprite-atlas'
import {Entity} from '../../entity/Entity'
import {EntityParser} from '../../entity/EntityParser'
import {LevelEditorSandbox} from './LevelEditorSandbox'
import {LocalStorage} from '../../storage/LocalStorage'

export namespace LevelEditorSandboxFileUtil {
  export function autoSave(sandbox: LevelEditorSandbox): void {
    const data = JSON.stringify(sandbox.toJSON().children, null, 2)
    LocalStorage.put(LocalStorage.Key.LEVEL_EDITOR_SANDBOX_AUTO_SAVE, data)
  }

  export function loadAutoSave(
    atlas: Atlas,
    sandbox: LevelEditorSandbox
  ): void {
    const data = LocalStorage.get(
      LocalStorage.Key.LEVEL_EDITOR_SANDBOX_AUTO_SAVE
    )
    if (data !== undefined) load(atlas, sandbox, data)
  }

  export function load(
    atlas: Atlas,
    sandbox: LevelEditorSandbox,
    data: string
  ): void {
    const config = JSON.parse(data)
    let sandboxChildren: Entity[] = []
    try {
      sandboxChildren = EntityParser.parseAll(atlas, config)
    } catch (e) {
      console.error(e, data, config)
      LocalStorage.put(LocalStorage.Key.LEVEL_EDITOR_SANDBOX_BACK_UP, data)
    }
    sandbox.addChildren(...sandboxChildren)
  }
}
