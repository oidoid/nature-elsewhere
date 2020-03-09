use web_sys::WebGlRenderingContext as Gl;

/// An enumeration of WebGL primitives.
#[repr(u32)]
#[derive(Clone, Copy, Debug, Deserialize, PartialEq)]
pub enum GlDataType {
  Byte = Gl::BYTE,
  UnsignedByte = Gl::UNSIGNED_BYTE,
  Short = Gl::SHORT,
  UnsignedShort = Gl::UNSIGNED_SHORT,
  Int = Gl::INT,
  UnsignedInt = Gl::UNSIGNED_INT,
  Float = Gl::FLOAT,
}

impl GlDataType {
  /// Returns the size in bytes of the type.
  pub fn size(self) -> i32 {
    match self {
      Self::Byte => 1,
      Self::UnsignedByte => 1,
      Self::Short => 2,
      Self::UnsignedShort => 2,
      Self::Int => 4,
      Self::UnsignedInt => 4,
      Self::Float => 4,
    }
  }
}
