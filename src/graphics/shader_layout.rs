use crate::math::CeilMultiple;
use serde::Deserialize;
use std::collections::HashMap;
use web_sys::WebGlRenderingContext as Gl;

#[derive(Clone)]
pub struct ShaderLayout {
  /// Uniform name to uniform name. Kind of silly because these are identical.
  pub uniforms: HashMap<String, String>,
  pub per_vertex: AttributeBuffer,
  pub per_instance: AttributeBuffer,
}

#[derive(Clone)]
pub struct AttributeBuffer {
  pub len: i32,
  pub stride: i32,
  pub divisor: u32,
  pub attributes: Vec<Attribute>,
}

#[derive(Clone)]
pub struct Attribute {
  pub data_type: GlDataType,
  pub name: String,
  pub len: i32,
  pub offset: i32,
}

#[derive(Clone, Deserialize)]
pub struct ShaderLayoutConfig {
  pub uniforms: HashMap<String, String>,
  pub per_vertex: Vec<AttributeConfig>,
  pub per_instance: Vec<AttributeConfig>,
}

#[derive(Clone, Deserialize)]
pub struct AttributeConfig {
  pub data_type: GlDataType,
  pub name: String,
  pub len: i32,
}

/// An enumeration of WebGL primitives.
#[repr(u32)]
#[derive(Clone, Copy, Deserialize)]
pub enum GlDataType {
  Byte = Gl::BYTE,
  UnsignedByte = Gl::UNSIGNED_BYTE,
  Short = Gl::SHORT,
  UnsignedShort = Gl::UNSIGNED_SHORT,
  Int = Gl::INT,
  UnsignedInt = Gl::UNSIGNED_INT,
  Float = Gl::FLOAT,
}

impl ShaderLayout {
  pub fn parse(config: ShaderLayoutConfig) -> Self {
    Self {
      uniforms: config.uniforms,
      per_vertex: parse_attributes(0, &config.per_vertex),
      per_instance: parse_attributes(1, &config.per_instance),
    }
  }
}

fn parse_attributes(
  divisor: u32,
  configs: &Vec<AttributeConfig>,
) -> AttributeBuffer {
  let attributes = configs.iter().fold(vec![], fold_attribute);
  let max_data_type_size = attributes
    .iter()
    .map(|Attribute { data_type, .. }| data_type.size())
    .fold(0, |max, val| max.max(val));
  let size = if attributes.is_empty() {
    0
  } else {
    next_attribute_offset(attributes[attributes.len() - 1].clone())
  };
  AttributeBuffer {
    len: attributes.iter().fold(0, |sum, Attribute { len, .. }| sum + len),
    stride: max_data_type_size.ceil_multiple(size),
    divisor,
    attributes,
  }
}

fn fold_attribute(
  mut layouts: Vec<Attribute>,
  attribute: &AttributeConfig,
) -> Vec<Attribute> {
  let offset = if layouts.is_empty() {
    0
  } else {
    next_attribute_offset(layouts[layouts.len() - 1].clone())
  };
  layouts.push(Attribute {
    data_type: attribute.data_type,
    name: attribute.name.clone(),
    len: attribute.len,
    offset,
  });
  layouts
}

fn next_attribute_offset(attribute: Attribute) -> i32 {
  attribute.offset + attribute.data_type.size() * attribute.len
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

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn parse() {
    let config =
      serde_json::from_str(include_str!("shader_layout.json")).unwrap();
    let layout = ShaderLayout::parse(config);
    assert_ne!(layout.uniforms.len(), 0);
    assert_ne!(layout.per_vertex.len, 0);
    assert_ne!(layout.per_instance.len, 0);
  }
}
