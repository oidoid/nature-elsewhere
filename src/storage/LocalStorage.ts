export namespace LocalStorage {
  export enum Key {
    LEVEL_EDITOR_SANDBOX_SLOT_0 = 'levelEditorSandboxSlot0',
    LEVEL_EDITOR_SANDBOX_SLOT_1 = 'levelEditorSandboxSlot1',
    LEVEL_EDITOR_SANDBOX_SLOT_2 = 'levelEditorSandboxSlot2',
    LEVEL_EDITOR_SANDBOX_AUTO_SAVE = 'levelEditorSandbox'
  }

  export function get(key: string): Maybe<string> {
    const val = localStorage.getItem(key)
    return val === null ? undefined : val
  }

  export function put(key: string, val: Maybe<string>): void {
    if (val === undefined) localStorage.removeItem(key)
    else localStorage.setItem(key, val)
  }

  export function clear() {
    localStorage.clear()
  }
}
