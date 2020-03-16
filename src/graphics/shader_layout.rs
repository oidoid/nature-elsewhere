use super::gl_data_type::GlDataType;
use crate::math::ceil::CeilMultiple;
use std::collections::HashMap;

// consider converting the json to a structur here.

#[derive(Clone, Debug)]
pub struct ShaderLayout {
  // used to avoid constants elsewhree. maybe th econfig can just be an array of strings though?
  pub uniforms: HashMap<String, String>,
  pub per_vertex: AttributeBuffer,
  pub per_instance: AttributeBuffer,
}

#[derive(Clone, Debug)]
pub struct AttributeBuffer {
  pub len: i32,
  pub stride: i32,
  pub divisor: u32,
  pub attributes: Vec<Attribute>,
}

#[derive(Clone, Debug)]
pub struct Attribute {
  pub data_type: GlDataType,
  pub name: String,
  pub len: i32,
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
  pub len: i32,
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
