/** Asserts that each array entry is unique. */
export function expectToContainSet<T>(
  arr: T[],
  equals: (lhs: T, rhs: T) => boolean
): void {
  arr.forEach((item, i) => expect(arr.findIndex(equals.bind(item))).toEqual(i))
}

/** Asserts that array contains partial object. */
export function expectToContainObjectContaining<T>(
  arr: T[],
  obj: Partial<T>
): void {
  expect(arr).toContainEqual(expect.objectContaining(obj))
}
