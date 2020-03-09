use super::atlas;
use super::atlas::Atlas;
use super::graphics::shader_layout::ShaderLayout;
use image::DynamicImage;

pub struct Assets {
  pub shader_layout: ShaderLayout,
  pub vertex_glsl: String,
  pub fragment_glsl: String,
  pub atlas: Atlas,
  pub atlas_image: DynamicImage,
}

impl Assets {
  pub fn load() -> Self {
    let shader_layout =
      ShaderLayout::parse(include_str!("graphics/shader_layout.json"));
    let vertex_glsl = include_str!("graphics/vertex_shader.glsl").to_string();
    let fragment_glsl =
      include_str!("graphics/fragment_shader.glsl").to_string();

    let atlas = atlas::parser::parse(include_str!("atlas/atlas.json"))
      .expect("Atlas parsing failed.");
    let atlas_image =
      image::load_from_memory(include_bytes!("atlas/atlas.png"))
        .expect("Atlas image loading failed.");

    Self { shader_layout, vertex_glsl, fragment_glsl, atlas, atlas_image }
  }
}
