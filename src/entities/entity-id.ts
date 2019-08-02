export enum EntityID {
  BEE,
  BUSH,
  CAM,
  CLOUD,
  CLOVER,
  CONIFER,
  GRASS,
  IMAGES,
  MOUNTAIN,
  PLAYER,
  TEXT_DATE_VERSION_HASH,
  TREE
}

export namespace EntityID {
  export type Key = keyof typeof EntityID
}
