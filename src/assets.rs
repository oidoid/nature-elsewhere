use super::atlas;
use super::atlas::Atlas;
use super::graphics::ShaderLayout;
use crate::text::Font;
use crate::wasm;
use wasm_bindgen::JsValue;
use web_sys::{Document, HtmlImageElement, Window};

pub struct Assets {
  pub shader_layout: ShaderLayout,
  pub vertex_glsl: String,
  pub fragment_glsl: String,
  pub atlas: Atlas,
  pub atlas_image: HtmlImageElement,
  pub font: Font,
}

impl Assets {
  pub async fn load(
    window: &Window,
    document: &Document,
  ) -> Result<Self, JsValue> {
    let shader_layout =
      wasm::fetch_json(window, "/graphics/shader_layout.json").await?;
    let shader_layout = ShaderLayout::parse(shader_layout);
    let vertex_glsl = wasm::fetch_text(
      window,
      "/graphics/vertex_shader.glsl",
      "text/x-vertex-glsl",
    )
    .await?;
    let fragment_glsl = wasm::fetch_text(
      window,
      "/graphics/fragment_shader.glsl",
      "text/x-fragment-glsl",
    )
    .await?;

    let atlas = &wasm::fetch_json(window, "/atlas/atlas.json").await?;
    let atlas = atlas::parse(atlas).map_err(|error| error.0)?;
    let atlas_image: HtmlImageElement =
      wasm::get_element_by_id(document, "atlas")?;

    let font: Font = wasm::fetch_json(window, "/text/mem_font.json").await?;

    Ok(Self {
      shader_layout,
      vertex_glsl,
      fragment_glsl,
      atlas,
      atlas_image,
      font,
    })
  }
}
