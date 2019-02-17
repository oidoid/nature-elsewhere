export function uniq<T>(equals: (lhs: T, rhs: T) => boolean) {
  return (item: T, _: number, array: ReadonlyArray<T>) =>
    array.findIndex(rhs => equals(item, rhs)) !== -1
}

export function range(
  start: number,
  end: number,
  step: number = start > end ? -1 : 1
): ReadonlyArray<number> {
  return Array(Math.ceil(Math.abs((start - end) / step)))
    .fill(undefined)
    .reduce(
      (sum: ReadonlyArray<number>, _, i) => sum.concat(start + i * step),
      []
    )
}
