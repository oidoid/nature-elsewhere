export function range(start: number, end: number): number[] {
  return Array(Math.abs(end - start))
    .fill(undefined)
    .reduce((sum: number[], _, i) => [...sum, start + i], [])
}
