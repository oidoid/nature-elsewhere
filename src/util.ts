export function range(start: number, end: number, step?: number): number[] {
  const interval = step ? step : start > end ? -1 : 1
  return Array(Math.ceil(Math.abs((start - end) / interval)))
    .fill(undefined)
    .reduce((sum: number[], _, i) => [...sum, start + i * interval], [])
}
