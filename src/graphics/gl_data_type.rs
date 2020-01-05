use web_sys::WebGlRenderingContext as Gl;

/// An enumeration of WebGL primitives.
#[repr(u32)]
#[derive(Clone, Copy, Debug, Deserialize)]
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
  pub fn size(self) -> i32 {
    match self {
      GlDataType::Byte => 1,
      GlDataType::UnsignedByte => 1,
      GlDataType::Short => 2,
      GlDataType::UnsignedShort => 2,
      GlDataType::Int => 4,
      GlDataType::UnsignedInt => 4,
      GlDataType::Float => 4,
    }
  }
}
