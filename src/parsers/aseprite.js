/**
 * This typing assumes the options specified in package.json and annotated
 * herein with **via CLI**. The JSON export format appears to be undocumented
 * but the related [binary format] is. Types marked "**by convention**" are
 * supplemental to and unenforced by the JSON format. Any data of these types
 * should be validated as soon as possible. All numbers are integers. All
 * indices are zero-based. All geometry are described from the top left to the
 * bottom right in pixel units.
 *
 * [binary format]: https://github.com/aseprite/aseprite/blob/master/docs/ase-file-specs.md
 */

/**
 * The topmost data type for JSON exported from Aseprite. This format contains
 * all the image, animation, and collision information for every file packed in
 * the atlas. **By convention**, every file has one or more animations. Every
 * animation has a Frame sequence, a Tag, and zero or more Slices.
 * @typedef {Object} File
 * @prop {Meta} meta
 * @prop {FrameMap} frames All Frames for all files packed.
 */

/** @typedef {Readonly<Record<TagFrameNumber, Frame>>} FrameMap */

/**
 * @typedef {Object} Meta
 * @prop {string} app E.g., 'http://www.aseprite.org/'.
 * @prop {string} version E.g., '1.2.8.1'.
 * @prop {string} image  The associated output. E.g., 'atlas.png'.
 * @prop {string} format E.g., 'RGBA8888' or 'I8'.
 * @prop {WH} size Output dimensions. **Via CLI** `--sheet-pack`, uses
 *                           a power of 2.
 * @prop {string} scale E.g., '1'.
 * @prop {ReadonlyArray<FrameTag>} frameTags All FrameTags for all files packed
 *                                           **via CLI** `--list-tags`.
 * @prop {ReadonlyArray<Slice>} slices All slices for all files packed
 *                                     **via CLI** `--list-slices`.
 */

/**
 * A Tag followed by a space followed by an optional frame number **via CLI**
 * `--filename-format '{tag} {frame}'`. The frame number is only optional when
 * it is zero in a single frame animation. E.g., 'cloud xl 4' refers to the file
 * named "cloud.aseprite" with animation named "xs", frame index 4, and 'sky  '
 * refers to the file named "sky.aseprite" with animation named "", the first
 * frame. See https://github.com/aseprite/aseprite/issues/1713.
 * @typedef {string} TagFrameNumber
 */

/**
 * **By convention**, Tags are a file stem followed by a space followed by a
 * possibly empty animation name and unique within the sheet. E.g., 'cactus xs'
 * describes the file named "cactus.aseprite" with animation named "xs" and
 * 'sun ' refers to the file named "sun.aseprite" with animation named "".
 * Animation names are use to distinguish different variations like size (s, m,
 * l) or state (walk, run, fly).
 * @typedef {string} Tag
 */

/**
 * A single animation frame and most primitive unit. Each file packed always
 * has at least one Frame.
 * @typedef {Object} Frame
 * @prop {Rect} frame The Frame's bounds within the atlas, including a 1px
 *                    border padding **via CLI** `--inner-padding 1`. The
 *                    padding dimensions may also be calculated by subtracting
 *                    member's WH dimensions from sourceSize and dividing by 2.
 * @prop {boolean} rotated
 * @prop {boolean} trimmed
 * @prop {Rect} spriteSourceSize The Frame's bounds within the file packed, not
 *                               including padding.
 * @prop {WH} sourceSize
 * @prop {Duration} duration
 */

/**
 * A label and animation behavior for one or more Frames. When combined with the
 * referenced Frames, an animation is represented.
 * @typedef {Object} FrameTag
 * @prop {Tag} name **By convention**, the associated Frame's Tag.
 * @prop {number} from The inclusive starting Frame index.
 * @prop {number} to The inclusive ending Frame index, possibly identical to the
 *                   starting frame index.
 * @prop {Direction} direction
 */

/**
 * Animation length in milliseconds or INFINITE_DURATION.
 * @typedef {number} Duration
 */

/**
 * **By convention**, animations that should never end have this reserved value.
 * @type {Duration}
 */
export const INFINITE_DURATION = 0xffff

/**
 * An animation's looping behavior.
 * @typedef {ValueOf<typeof Direction>} Direction
 */
export const Direction = {
  /** Animate from start to end; when looping, return to start. */
  FORWARD: 'forward',
  /** Animate from end to start; when looping, return to end. */
  REVERSE: 'reverse',
  /**
   * Animate from start to end - 1 or start, whichever is greater; when looping,
   * change direction (initially, end to start + 1 or end, whichever is lesser.
   * Traversals from start to end - 1 and end to start + 1 are each considered
   * complete loops.
   */
  PING_PONG: 'pingpong'
}

/**
 * **By convention**, a collection of bounds within the file packed whose union
 * defines the total collision polygon for a single Frame.
 * @typedef {Object} Slice
 * @prop {Tag} name
 * @prop {string} color Color in #rrggbbaa format. E.g., blue is '#0000ffff'.
 * @prop {ReadonlyArray<Key>} keys
 */

/**
 * A Frame collision boundary subset within the file packed.
 * @typedef {Object} Key
 * @prop {number} frame The inclusive associated Frame's start offset, the
 *                      exclusive previous Frame's end offset.
 *                      **By convention,** the exclusive end offset is the next
 *                      higher Key.frame if it exists or the animation's end if
 *                      not. A Key's Frame index may be calculated from
 *                      FrameTag.index + Key.frame.
 * @prop {Rect} bounds The Frame's collision boundary within the file packed.
 */
