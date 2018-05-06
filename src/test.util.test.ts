/**
 * @param {Equals} equals e.g., {@link Object.is}.
 * Asserts that each array entry is unique.
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
