import {Atlas} from 'aseprite-atlas'
import {Entity} from '../../entity/Entity'
import {EntityParser} from '../../entity/EntityParser'
import {LevelEditorSandbox} from './LevelEditorSandbox'
import {LocalStorage} from '../../storage/LocalStorage'

export namespace LevelEditorSandboxFileUtil {
  export function autoSave(sandbox: LevelEditorSandbox): void {
    const data = JSON.stringify(sandbox.toJSON(), null, 2)
    LocalStorage.put(LocalStorage.Key.LEVEL_EDITOR_SANDBOX_AUTO_SAVE, data)
  }

  export function loadAutoSave(
    sandbox: LevelEditorSandbox,
    atlas: Atlas
  ): void {
    const data = LocalStorage.get(
      LocalStorage.Key.LEVEL_EDITOR_SANDBOX_AUTO_SAVE
    )
    if (data !== undefined) load(sandbox, atlas, data)
  }

  export function load(
    sandbox: LevelEditorSandbox,
    atlas: Atlas,
    data: string
  ): void {
    const config = JSON.parse(data)
    let sandboxChildren: Entity[] = []
    try {
      sandboxChildren = EntityParser.parseAll(config, atlas)
    } catch (e) {
      console.error(e, data, config)
      LocalStorage.put(LocalStorage.Key.LEVEL_EDITOR_SANDBOX_BACK_UP, data)
    }
    sandbox.addChildren(...sandboxChildren)
  }
}
