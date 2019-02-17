interface LevelUpdate {
  readonly nextLevel?: Level
  readonly instances: DataView
  readonly length: number
}

interface Level {
  scale(): number
  update(then: number, now: number, cam: Rect): LevelUpdate
}
