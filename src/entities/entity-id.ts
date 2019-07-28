export enum EntityID {
  CAM,
  CLOUD,
  CONIFER,
  IMAGES,
  MOUNTAIN,
  PLAYER,
  TEXT_DATE_VERSION_HASH
}

export namespace EntityID {
  export type Key = keyof typeof EntityID
}
