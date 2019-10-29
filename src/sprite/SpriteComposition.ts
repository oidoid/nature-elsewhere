// See https://developer.android.com/reference/android/graphics/PorterDuff.Mode.
export enum SpriteComposition {
  /** The constituent is unused. The source is rendered unaltered. */
  SOURCE,
  /** The constituent is rendered with the source's alpha. */
  SOURCE_MASK,
  /** The source is rendered where the source AND constituent's alpha are
      nonzero. */
  SOURCE_IN,
  /** The source is rendered with the constituent's alpha. The distinction from
      SOURCE_MASK is useful since the source controls animation playback. */
  CONSTITUENT_MASK
}
