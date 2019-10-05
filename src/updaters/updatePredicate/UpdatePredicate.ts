/** All of an entity's updaters are invoked until exhausted or
    UpdateStatus.TERMINATE is returned. Child updaters are not invoked by
    default. The parent decides whether to update them so that it knows when to
    invalidate itself. Updaters can change the imagery but are otherwise
    independent of animation. */
export enum UpdatePredicate {
  /** If entity bounds intersects the camera bounds. Does not consider
      EntityState.HIDDEN or images. Do not use this predicate for entities that
      follow the camera or otherwise enter from outside the viewport. */
  INTERSECTS_VIEWPORT = 'intersectsViewport',
  ALWAYS = 'always'
}
