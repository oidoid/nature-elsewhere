use super::graphics::gl_util;
use super::graphics::renderer_state_machine::RendererStateMachine;
use crate::graphics::shader_layout::ShaderLayout;
use image::{DynamicImage, GenericImageView};
use num::traits::cast::ToPrimitive;
use std::cell::RefCell;
use std::convert::TryFrom;
use std::rc::Rc;
use wasm_bindgen::prelude::JsValue;
use web_sys::{
  console, Event, HtmlCanvasElement,
  WebGlContextAttributes as GlContextAttributes, WebGlRenderingContext as Gl,
  Window,
};
pub struct Game {
  win: Window,
  canvas: HtmlCanvasElement,
  renderer_state_machine: RendererStateMachine,
}

impl Game {
  pub fn new(
    shader_layout: ShaderLayout,
    vert_glsl: String,
    frag_glsl: String,
    win: Window,
    canvas: HtmlCanvasElement,
    atlas_img: DynamicImage,
  ) -> Self {
    let renderer_state_machine = RendererStateMachine::new(
      shader_layout,
      vert_glsl,
      frag_glsl,
      atlas_img,
      win.clone(),
      canvas.clone(),
    );
    Game { win, canvas, renderer_state_machine }
  }

  pub fn start(&mut self) {
    self.renderer_state_machine.start();
  }

  pub fn stop(&mut self) {
    self.renderer_state_machine.stop();
  }

  fn on_pause(&mut self) {
    console::log_1(&"Paused.".into());
    self.stop()
  }
}
