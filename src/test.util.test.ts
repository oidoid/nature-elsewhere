/**
 * Asserts that each array entry is unique.
 * @param {Equals} equals E.g., {@link Object.is}.
 */
export function expectToContainSet<T>(arr: T[], equals: Equals<T>): void {
  arr.forEach((lhs, index) =>
    expect(arr.findIndex(rhs => equals(lhs, rhs))).toEqual(index)
  )
}

/** Asserts that array contains partial object. */
export function expectToContainObjectContaining<T>(
  arr: T[],
  obj: Partial<T>
): void {
  expect(arr).toContainEqual(expect.objectContaining(obj))
}

/** @param {Equals} equals E.g., {@link Object.is}. */
export function uniq<T>(
  equals: Equals<T>
): (value: T, index: number, array: T[]) => boolean {
  return (item, _, array) => array.findIndex(rhs => equals(item, rhs)) !== -1
}
