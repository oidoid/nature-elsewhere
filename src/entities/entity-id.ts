export enum EntityID {
  BEE,
  CAM,
  CLOUD,
  CLOVER,
  CONIFER,
  IMAGES,
  MOUNTAIN,
  PLAYER,
  TEXT_DATE_VERSION_HASH,
  TREE
}

export namespace EntityID {
  export type Key = keyof typeof EntityID
}
