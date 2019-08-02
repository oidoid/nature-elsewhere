export enum UpdateType {
  NEVER,
  IF_VISIBLE,
  ALWAYS
}

export namespace UpdateType {
  export type Key = keyof typeof UpdateType
}
