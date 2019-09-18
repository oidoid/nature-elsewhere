/** Collisions bodies are a subset of entity bounds. In some cases, a
    bounds-only test is sufficient. In other cases, bounds-and-bodies tests are
    necessary for additional precision. The entity bounds is still checked in
    the latter cases since it is a superset of the union of rectangular
    collision bodies and quick.

    Some entities compose entities as children. Since children are a subset of
    an entity's bounds, the quick entity bounds test is a predicate to descent.

    Although the rectangular intersection mechanism is similar, all collision
    tests are independent of layout, drawing, and update intersection tests. */
export enum CollisionPredicate {
  /** No intersection tests on the entity or its children. All tests are
      considered failed. */
  NEVER = 'never',
  /** Intersection tests on only the specifying entity's bounds. Any collision
      bodies and children are ignored. */
  BOUNDS = 'bounds',
  /** Intersection tests on only the specifying entity's bounds and collision
      bodies. The bounds and _any_ body must intersect to pass the test. If the
      entity has no bodies, the test fails. Children are not solicited. */
  BODIES = 'bodies',
  /** Intersection tests on the specifying entity's bounds and, if passed, test
      all descendants recursively as specified by each parent in the chain for
      the first passing child. If a child collides, the top-most parents are
      tasked with resolution in their updaters. The child does not get the
      option unless requested by the parent's updater. */
  CHILDREN = 'children'
}
