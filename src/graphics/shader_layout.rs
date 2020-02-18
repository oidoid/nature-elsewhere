use super::gl_data_type::GlDataType;
use crate::math::ceil::CeilMultiple;
use std::collections::HashMap;

// consider converting the json to a structur here.

#[derive(Clone, Debug)]
pub struct ShaderLayout {
  // used to avoid constants elsewhree. maybe th econfig can just be an array of strings though?
  pub uniforms: HashMap<String, String>,
  pub per_vert: AttrBuffer,
  pub per_instance: AttrBuffer,
}

#[derive(Clone, Debug)]
pub struct AttrBuffer {
  pub len: i32,
  pub stride: i32,
  pub divisor: u32,
  pub attrs: Vec<Attr>,
}

#[derive(Clone, Debug)]
pub struct Attr {
  pub data_type: GlDataType,
  pub name: String,
  pub len: i32,
  pub offset: i32,
}

#[derive(Clone, Debug, Deserialize)]
pub struct ShaderLayoutConfig {
  pub uniforms: HashMap<String, String>,
  pub per_vert: Vec<AttrConfig>,
  pub per_instance: Vec<AttrConfig>,
}

#[derive(Clone, Debug, Deserialize)]
pub struct AttrConfig {
  pub data_type: GlDataType,
  pub name: String,
  pub len: i32,
}

impl ShaderLayout {
  pub fn parse(json: &str) -> Self {
    let config: Box<ShaderLayoutConfig> = serde_json::from_str(&json)
      .expect("ShaderLayoutConfig JSON parsing failed.");
    Self {
      uniforms: config.uniforms,
      per_vert: parse_attrs(0, &config.per_vert),
      per_instance: parse_attrs(1, &config.per_instance),
    }
  }
}

fn parse_attrs(divisor: u32, configs: &Vec<AttrConfig>) -> AttrBuffer {
  let attrs = configs.iter().fold(vec![], fold_attr);
  let max_data_type_size = attrs
    .iter()
    .map(|Attr { data_type, .. }| data_type.size())
    .fold(0, |max, val| max.max(val));
  let size = if attrs.is_empty() {
    0
  } else {
    next_attr_offset(attrs[attrs.len() - 1].clone())
  };
  AttrBuffer {
    len: attrs.iter().fold(0, |sum, Attr { len, .. }| sum + len),
    stride: max_data_type_size.ceil_multiple(size),
    divisor,
    attrs,
  }
}

fn fold_attr(mut layouts: Vec<Attr>, attr: &AttrConfig) -> Vec<Attr> {
  let offset = if layouts.is_empty() {
    0
  } else {
    next_attr_offset(layouts[layouts.len() - 1].clone())
  };
  layouts.push(Attr {
    data_type: attr.data_type,
    name: attr.name.clone(),
    len: attr.len,
    offset,
  });
  layouts
}

fn next_attr_offset(attr: Attr) -> i32 {
  attr.offset + attr.data_type.size() * attr.len
}

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn parse() {
    let config = include_str!("shader_layout.json");
    let layout = ShaderLayout::parse(config);
    assert_ne!(layout.uniforms.len(), 0);
    assert_ne!(layout.per_vert.len, 0);
    assert_ne!(layout.per_instance.len, 0);
  }
}
