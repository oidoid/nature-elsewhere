export enum EntityID {
  BACKGROUND,
  CAM,
  CLOUD,
  CONIFER,
  MOUNTAIN,
  PLAYER,
  TEXT_DATE_VERSION_HASH
}

export namespace EntityID {
  export type Key = keyof typeof EntityID
}
