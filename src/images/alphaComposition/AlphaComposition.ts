export enum AlphaComposition {
  /** The source image is rendered with its own alpha. */
  SOURCE,
  /** The source image is rendered with the mask alpha. */
  MASK,
  /** The source image is rendered where the source AND mask alpha are
      nonzero. */
  AND
}

export namespace AlphaComposition {
  export type Key = keyof typeof AlphaComposition
}
