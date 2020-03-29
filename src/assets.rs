use super::atlas;
use super::atlas::Atlas;
use super::graphics::ShaderLayout;
use crate::blueprints::{Blueprint, BlueprintID};
use crate::text::Font;
use crate::wasm;
use std::collections::HashMap;
use strum::IntoEnumIterator;
use wasm_bindgen::JsValue;
use web_sys::{Document, HtmlImageElement, Window};

pub struct Assets {
  pub renderer_assets: RendererAssets,
  pub font: Font,
  pub blueprints: HashMap<BlueprintID, Blueprint>,
}

pub struct RendererAssets {
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
    let renderer_assets = RendererAssets::load(window, document).await?;

    let font: Font = wasm::fetch_json(window, "/text/mem_font.json").await?;

    let mut blueprints = HashMap::new();
    for id in BlueprintID::iter() {
      let blueprint =
        wasm::fetch_json(window, &id.blueprint_filename()).await?;
      blueprints.insert(id, blueprint);
    }

    Ok(Self { renderer_assets, font, blueprints })
  }
}

impl RendererAssets {
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

    Ok(Self { shader_layout, vertex_glsl, fragment_glsl, atlas, atlas_image })
  }
}
