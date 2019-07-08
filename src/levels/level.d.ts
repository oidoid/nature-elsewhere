interface LevelUpdate {
  readonly nextLevel?: Level
  readonly data: DataView
  readonly length: number
}

interface Level {
  scale(canvas: WH): number
  update(time: number, canvas: WH, cam: Rect): LevelUpdate
}
