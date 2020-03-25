use serde_repr::Serialize_repr;

// See https://developer.android.com/reference/android/graphics/PorterDuff.Mode.
#[repr(u8)]
#[derive(Serialize_repr, Clone, Copy, Debug, PartialEq, Deserialize)]
pub enum SpriteComposition {
  /// The constituent is unused. The source is rendered unaltered.
  Source,
  /// The constituent is rendered with the source's alpha.
  SourceMask,
  /// The source is rendered where the source AND constituent's alpha are
  /// nonzero.
  SourceIn,
  /// The source is rendered with the constituent's alpha. The distinction from
  /// SourceMask is useful since the source controls animation playback.
  ConstituentMask,
}
