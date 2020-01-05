use super::super::math::ceil::CeilMultiple;
use super::gl_data_type::GlDataType;
use std::collections::HashMap;

#[derive(Clone, Debug)]
pub struct ShaderLayout {
  pub uniforms: HashMap<String, String>,
  pub per_vertex: AttributeBuffer,
  pub per_instance: AttributeBuffer,
}

#[derive(Clone, Debug)]
pub struct AttributeBuffer {
  pub length: i32,
  pub stride: i32,
  pub divisor: u32,
  pub attributes: Vec<Attribute>,
}

#[derive(Clone, Debug)]
pub struct Attribute {
  pub data_type: GlDataType,
  pub name: String,
  pub length: i32,
  pub offset: i32,
}

#[derive(Clone, Debug, Deserialize)]
pub struct ShaderLayoutConfig {
  pub uniforms: HashMap<String, String>,
  pub per_vertex: Vec<AttributeConfig>,
  pub per_instance: Vec<AttributeConfig>,
}

#[derive(Clone, Debug, Deserialize)]
pub struct AttributeConfig {
  pub data_type: GlDataType,
  pub name: String,
  pub length: i32,
}

impl ShaderLayout {
  pub fn parse(config: ShaderLayoutConfig) -> ShaderLayout {
    ShaderLayout {
      uniforms: config.uniforms,
      per_vertex: parse_attributes(0, config.per_vertex),
      per_instance: parse_attributes(1, config.per_instance),
    }
  }
}

fn parse_attributes(
  divisor: u32,
  configs: Vec<AttributeConfig>,
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
    length: attributes
      .iter()
      .fold(0, |sum, Attribute { length, .. }| sum + length),
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
    length: attribute.length,
    offset,
  });
  layouts
}

fn next_attribute_offset(attribute: Attribute) -> i32 {
  attribute.offset + attribute.data_type.size() * attribute.length
}

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn parse() {
    let json = include_str!("shader_layout_config.json");
    let config: ShaderLayoutConfig = serde_json::from_str(&json).unwrap();
    let layout = ShaderLayout::parse(config);
    assert_ne!(layout.uniforms.len(), 0);
    assert_ne!(layout.per_vertex.length, 0);
    assert_ne!(layout.per_instance.length, 0);
  }
}
