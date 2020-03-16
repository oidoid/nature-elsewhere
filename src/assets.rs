use super::atlas;
use super::atlas::Atlas;
use super::graphics::shader_layout::ShaderLayout;
use crate::wasm;
use crate::wasm::fetch;
use wasm_bindgen::{JsCast, JsValue};
use web_sys::{Document, HtmlImageElement, Window};

pub struct Assets {
  pub shader_layout: ShaderLayout,
  pub vertex_glsl: String,
  pub fragment_glsl: String,
  pub atlas: Atlas,
  pub atlas_image: HtmlImageElement,
}

impl Assets {
  pub async fn load(
    window: &Window,
    document: &Document,
  ) -> Result<Self, JsValue> {
    let shader_layout =
      fetch::json(window, "/graphics/shader_layout.json").await?;

    let shader_layout = ShaderLayout::parse(shader_layout);
    let vertex_glsl =
      fetch::text(window, "/graphics/vertex_shader.glsl", "text/x-vertex-glsl")
        .await?;
    let fragment_glsl = fetch::text(
      window,
      "/graphics/fragment_shader.glsl",
      "text/x-fragment-glsl",
    )
    .await?;

    let atlas = &fetch::json(window, "/atlas/atlas.json").await?;
    let atlas = atlas::parser::parse(atlas).expect("Atlas parsing failed.");
    let atlas_image: HtmlImageElement =
      wasm::get_element_by_id(document, "atlas")?.dyn_into()?;

    Ok(Self { shader_layout, vertex_glsl, fragment_glsl, atlas, atlas_image })
  }
}
