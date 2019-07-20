export interface LevelUpdate {
  readonly nextLevel?: Level
  readonly dat: DataView
  readonly len: number
}

export interface Level {
  scale(canvas: WH): number
  update(time: number, canvas: WH, cam: Rect): LevelUpdate
}
