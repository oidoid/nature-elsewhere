use super::atlas;
use super::atlas::Atlas;
use super::graphics::shader_layout::ShaderLayout;
use image::DynamicImage;

pub struct Assets {
  pub shader_layout: ShaderLayout,
  pub vert_glsl: String,
  pub frag_glsl: String,
  pub atlas: Atlas,
  pub atlas_img: DynamicImage,
}

impl Assets {
  pub fn load() -> Self {
    let shader_layout =
      ShaderLayout::parse(include_str!("graphics/shader_layout.json"));
    let vert_glsl = include_str!("graphics/vert.glsl").to_string();
    let frag_glsl = include_str!("graphics/frag.glsl").to_string();

    let atlas = atlas::parser::parse(include_str!("atlas/atlas.json"))
      .expect("Atlas parsing failed.");
    let atlas_img = image::load_from_memory(include_bytes!("atlas/atlas.png"))
      .expect("Atlas image loading failed.");

    Self { shader_layout, vert_glsl, frag_glsl, atlas, atlas_img }
  }
}
