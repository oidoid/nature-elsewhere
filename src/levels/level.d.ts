interface LevelUpdate {
  readonly nextLevel: Level
  readonly data: DataView
  readonly length: number
}

interface Level {
  update(then: number, now: number, cam: Rect): LevelUpdate
}
