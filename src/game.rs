use super::graphics::gl_util;
use image::DynamicImage;
use web_sys::HtmlCanvasElement;
use web_sys::WebGlRenderingContext as Gl;

pub struct Game {
  canvas: HtmlCanvasElement,
  gl: Gl,
}

impl Game {
  pub fn new(canvas: HtmlCanvasElement, atlas_image: DynamicImage) -> Game {
    let gl = gl_util::get_context(&canvas);

    Game { canvas, gl }
  }
}
