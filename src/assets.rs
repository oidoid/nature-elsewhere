use super::atlas;
use super::atlas::Atlas;
use super::graphics::ShaderLayout;
use crate::manufacturer::{Blueprint, BlueprintID};
use crate::text::Font;
use crate::wasm;
use std::collections::HashMap;
use strum::IntoEnumIterator;
use wasm_bindgen::JsValue;
use web_sys::{Document, HtmlImageElement, Window};

pub struct Assets {
  pub renderer_assets: RendererAssets,
  pub atlas: Atlas,
  pub font: Font,
  pub blueprints: HashMap<BlueprintID, Blueprint>,
}

pub struct RendererAssets {
  pub shader_layout: ShaderLayout,
  pub vertex_glsl: String,
  pub fragment_glsl: String,
  pub atlas_image: HtmlImageElement,
}

impl Assets {
  pub async fn load(
    window: &Window,
    document: &Document,
  ) -> Result<Self, JsValue> {
    let renderer_assets = RendererAssets::load(window, document).await?;

    let atlas = &wasm::fetch_json(window, "/atlas/atlas.json").await?;
    let atlas = atlas::parse(atlas).map_err(|error| error.0)?;

    let font: Font = wasm::fetch_json(window, "/text/mem_font.json").await?;

    let mut blueprints = HashMap::new();
    for id in BlueprintID::iter() {
      let blueprint = wasm::fetch_json(window, &id.filename()).await?;
      blueprints.insert(id, blueprint);
    }

    Ok(Self { renderer_assets, atlas, font, blueprints })
  }
}

impl BlueprintID {
  pub fn filename(&self) -> String {
    let name = match self {
      Self::Bee => "bee",
      Self::RainCloud => "rain_cloud",
      Self::Button => "button",
      Self::SaveDialog => "save_dialog",
      Self::Cursor => "cursor",
      Self::Map => "map",
      Self::Fruit => "fruit",
      Self::AppleTree => "apple_tree",
      Self::Item => "item",
      Self::Backpacker => "backpacker",
      Self::Bunny => "bunny",
      Self::Fly => "fly",
      Self::Flower => "flower",
      Self::Frog => "frog",
      Self::Pig => "pig",
      Self::Snake => "snake",
      Self::Group => "group",
      Self::LevelEditorSandbox => "level_editor_sandbox",
      Self::Bush => "bush",
      Self::Cattails => "cattails",
      Self::Cloud => "cloud",
      Self::Clover => "clover",
      Self::Compartment => "compartment",
      Self::Conifer => "conifer",
      Self::Flag => "flag",
      Self::Grass => "grass",
      Self::Monument => "monument",
      Self::Mountain => "mountain",
      Self::Path => "path",
      Self::Plane => "plane",
      Self::Pond => "pond",
      Self::Subshrub => "subshrub",
      Self::Tree => "tree",
      Self::UIButton => "ui_button",
      Self::LifeCounter => "life_counter",
      Self::NinePatch => "nine_patch",
      Self::PlayerStatus => "player_status",
      Self::UICheckbox => "ui_checkbox",
      Self::UICursor => "ui_cursor",
      Self::UICursorDot => "ui_cursor_dot",
      Self::UICursorHand => "ui_cursor_hand",
      Self::UICursorReticle => "ui_cursor_reticle",
      Self::UIDateVersionHash => "ui_date_version_hash",
      Self::UIDestinationMarker => "ui_destination_marker",
      Self::UIEntityPicker => "ui_entity_picker",
      Self::UILevelEditorPanelMenu => "ui_level_editor_panel_menu",
      Self::UILevelEditorPanel => "ui_level_editor_panel",
      Self::UILevelEditorPanelBackground => "ui_level_editor_panel_background",
      Self::UILevelLink => "ui_level_link",
      Self::UIMarquee => "ui_marquee",
      Self::UIRadioCheckboxGroup => "ui_radio_checkbox_group",
      Self::UIText => "ui_text",
      Self::UIToolbar => "ui_toolbar",
    };
    // format!("/manufacturer/blueprints/{}.json", name)
    "/manufacturer/blueprints/foo.json".to_string()
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

    let atlas_image: HtmlImageElement =
      wasm::get_element_by_id(document, "atlas")?;

    Ok(Self { shader_layout, vertex_glsl, fragment_glsl, atlas_image })
  }
}
