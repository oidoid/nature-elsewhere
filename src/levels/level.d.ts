interface Level {
  update(
    then: number,
    now: number,
    cam: Rect
  ): {nextLevel: Level; dataView: DataView; length: number}
}
