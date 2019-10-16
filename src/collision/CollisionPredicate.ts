/** Collisions bodies are a subset of entity bounds. In some cases, a
    bounds-only test is sufficient. In other cases, bounds-and-bodies or image
    rectangle tests are necessary for additional precision. The entity bounds is
    still checked in the latter cases since it is a superset of the union of
    rectangular collision bodies and a quick narrowing test.

    Some entities compose entities as children. Since children are a subset of
    an entity's bounds, the quick entity bounds test is a predicate to descent.
    That is, a shallow descent is _assumed_ unless CHILDREN collision predicate
    is specified.

    Although the rectangular intersection mechanism is similar, all collision
    tests are independent of layout, drawing, and update intersection tests.

    CollisionPredicates apply only to one half of a collision test. The other
    entity's collision predicate is honored.

    BOUNDS, IMAGES, and BODIES apply to the owning entity only. An OR'd
    predicate of BOUNDS | IMAGES | BODIES but an intersecting entity tested will
    be included once even if it matches multiple predicates. ORing with CHILDREN
    only has the additional behavior of accumulating the result of
    descending. */
export enum CollisionPredicate {
  /** No intersection tests on the entity or its children regardless of their
      predicates. All tests are considered failed. */
  NEVER = 0b0000,

  /** Intersection tests on only the specifying entity's bounds. Any collision
      bodies and children are ignored. */
  BOUNDS = 0b0001,

  /** Intersection tests on only the specifying entity's bounds and images for
      the current state. Any collision bodies and children are ignored. This is
      useful for non-rectangular panels that appear above other entities and
      wish to consume all collisions for the entities they obscure. */
  IMAGES = 0b0010,

  /** Intersection tests on only the specifying entity's bounds and collision
      bodies. The bounds and _any_ body must intersect to pass the test. If the
      entity has no bodies, the test fails. Children are not solicited. */
  BODIES = 0b0100,

  /** Intersection tests on the specifying entity's bounds and, if passed, test
      all descendants recursively as specified by each parent in the chain for
      the first passing child. If a child collides, the top-most parents are
      tasked with resolution in their updaters. The child does not get the
      option unless requested by the parent's updater. */
  CHILDREN = 0b1000
}
