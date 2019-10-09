export enum AlphaComposition {
  /** The image is rendered with its own alpha. */
  IMAGE,
  /** The image is rendered with the source's alpha. */
  SOURCE_MASK,
  /** The image is rendered where the image AND source alpha are nonzero. */
  AND
}
