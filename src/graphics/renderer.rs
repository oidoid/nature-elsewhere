use super::gl_util;
use super::rgba::RGBA;
use super::shader_layout::ShaderLayout;
use crate::math::rect::R16;
use crate::math::wh::WH16;
use num::traits::cast::ToPrimitive;
use std::collections::HashMap;
use std::convert::From;
use wasm_bindgen::JsCast;
use web_sys::{
  AngleInstancedArrays, HtmlCanvasElement, HtmlImageElement,
  OesVertexArrayObject, WebGlBuffer as GlBuffer,
  WebGlContextAttributes as GlContextAttributes, WebGlRenderingContext as Gl,
  WebGlUniformLocation as GlUniformLocation, WebglLoseContext as GlLoseContext,
};

#[derive(Debug)]
pub struct Renderer {
  canvas: HtmlCanvasElement,
  gl: Gl,
  instanced_arrays: AngleInstancedArrays,
  vertex_array_object: OesVertexArrayObject,
  layout: ShaderLayout,
  uniforms: HashMap<String, GlUniformLocation>,
  attributes: HashMap<String, u32>,
  projection: [f32; 4 * 4],
  per_instance_buffer: Option<GlBuffer>,
  lose_context: GlLoseContext,
}

static UV: [i16; 8] = [1, 1, 0, 1, 1, 0, 0, 0];

impl Renderer {
  pub fn new(
    layout: &ShaderLayout,
    vertex_glsl: &str,
    fragment_glsl: &str,
    atlas: &HtmlImageElement,
    canvas: HtmlCanvasElement,
  ) -> Self {
    let gl = gl_util::get_context(
      &canvas,
      &GlContextAttributes::new()
        .alpha(false)
        .depth(false)
        .antialias(false)
     // https://www.chromestatus.com/feature/6360971442388992
        // .low_latency(true),
    )
    .expect("WebGL context unavailable.");

    let instanced_arrays: AngleInstancedArrays = gl
      .get_extension("ANGLE_instanced_arrays")
      .expect("WebGL extensions unavailable.")
      .expect("WebGL ANGLE_instanced_arrays unavailable.")
      .unchecked_into();

    let vertex_array_object: OesVertexArrayObject = gl
      .get_extension("OES_vertex_array_object")
      .expect("WebGL extensions unavailable.")
      .expect("WebGL OES_vertex_array_object unavailable.")
      .unchecked_into();

    let lose_context: GlLoseContext = gl
      .get_extension("WEBGL_lose_context")
      .expect("WebGL extensions unavailable.")
      .expect("WebGL WEBGL_lose_context unavailable.")
      .unchecked_into();

    // Avoid initial color flash by matching the background. [palette]
    let rgba: RGBA = 0xf2f5f5ff.into();
    gl.clear_color(rgba.r, rgba.g, rgba.b, rgba.a);
    gl.clear(Gl::COLOR_BUFFER_BIT);

    // Allow transparent textures to be layered.
    gl.enable(Gl::BLEND);
    gl.blend_func(Gl::SRC_ALPHA, Gl::ONE_MINUS_SRC_ALPHA);

    // Disable image colorspace conversions. The default is browser dependent.
    gl.pixel_storei(Gl::UNPACK_COLORSPACE_CONVERSION_WEBGL, 0);

    let program = gl_util::load_program(&gl, vertex_glsl, fragment_glsl)
      .expect("WebGL shaders unable to load.");
    let uniforms = gl_util::uniform_locations(&gl, &program)
      .expect("WebGL uniforms unavailable.");
    gl.uniform1i(
      uniforms
        .get(layout.uniforms.get("atlas").expect("Missing \"atlas\" uniform.")),
      0,
    );
    gl.uniform2i(
      uniforms.get(
        layout
          .uniforms
          .get("atlas_size")
          .expect("Missing \"atlas_size\" uniform."),
      ),
      atlas.width().to_i32().expect("Atlas width u32 to i32 failed."),
      atlas.height().to_i32().expect("Atlas height u32 to i32 failed."),
    );

    let attributes = gl_util::attr_locations(&gl, &program)
      .expect("WebGL attributes unavailable.");

    let vertex_array = vertex_array_object.create_vertex_array_oes();
    vertex_array_object.bind_vertex_array_oes(vertex_array.as_ref());

    let per_vertex_buffer = gl.create_buffer();
    for attr in layout.per_vertex.attributes.iter() {
      gl_util::init_attr(
        &gl,
        &instanced_arrays,
        layout.per_vertex.stride,
        layout.per_vertex.divisor,
        per_vertex_buffer.as_ref(),
        *attributes
          .get(&attr.name)
          .expect(&format!("Missing attribute \"{}\".", attr.name)),
        &attr,
      );
    }
    // let bytes = [u8; uv.len() * 2];
    // let bytes = uv.into_iter().fold(|val| val.to_ne_bytes(), bytes);
    let bytes: Vec<u8> =
      bincode::config().native_endian().serialize(&UV).unwrap();
    gl_util::buffer_data(
      &gl,
      per_vertex_buffer.as_ref(),
      // &uv.try_into().expect("UV [i16] to [u8] conversion failed."),
      &bytes,
      Gl::STATIC_DRAW,
    );

    let per_instance_buffer = gl.create_buffer();
    for attribute in layout.per_instance.attributes.iter() {
      gl_util::init_attr(
        &gl,
        &instanced_arrays,
        layout.per_instance.stride,
        layout.per_instance.divisor,
        per_instance_buffer.as_ref(),
        *attributes
          .get(&attribute.name)
          .expect(&format!("Missing attribute \"{}\".", attribute.name)),
        &attribute,
      );
    }

    // Leave vertexArray bound.

    gl.bind_texture(
      Gl::TEXTURE_2D,
      gl_util::load_texture(&gl, Gl::TEXTURE0, atlas).as_ref(),
    );
    // Leave texture bound.

    Self {
      canvas,
      gl,
      instanced_arrays,
      vertex_array_object,
      layout: layout.clone(),
      uniforms,
      attributes,
      projection: [0.; 16],
      per_instance_buffer,
      lose_context,
    }
  }

  pub fn is_context_lost(&self) -> bool {
    self.gl.is_context_lost()
  }

  pub fn dbg_lose_context(&self) {
    self.lose_context.lose_context();
  }

  pub fn dbg_restore_context(&self) {
    self.lose_context.restore_context();
  }

  /// canvas_wh The desired resolution of the canvas in CSS pixels. E.g.,
  ///           {w: window.innerWidth, h: window.innerHeight}.
  /// time elapsed game time
  /// scale Positive integer zoom.
  pub fn render(
    &mut self,
    time: i32,
    canvas_wh: &WH16,
    scale: i16,
    cam: &R16,
    dat: &[u8],
  ) {
    self.resize(canvas_wh, scale, cam);
    self.gl.uniform1i(
      self.uniforms.get(
        self.layout.uniforms.get("time").expect("Missing \"time\" uniform."),
      ),
      time,
    );
    gl_util::buffer_data(
      &self.gl,
      self.per_instance_buffer.as_ref(),
      dat,
      Gl::DYNAMIC_DRAW,
    );
    let len =
      dat.len().to_i32().expect("Data length usize to i32 conversion failed.")
        / self.layout.per_instance.stride;
    self.instanced_arrays.draw_arrays_instanced_angle(
      Gl::TRIANGLE_STRIP,
      0,
      (UV.len() / 2) // dimensions
        .to_i32()
        .expect("uv length usize to i32 conversion failed."),
      len,
    );
  }

  fn resize(&mut self, canvas_wh: &WH16, scale: i16, cam: &R16) {
    self.canvas.set_width(
      canvas_wh.w.to_u32().expect("Canvas width i16 to u32 conversion failed."),
    );
    self.canvas.set_height(
      canvas_wh
        .h
        .to_u32()
        .expect("Canvas height i16 to u32 conversion failed."),
    );

    self.project_through(cam);

    self.gl.uniform_matrix4fv_with_f32_array(
      self.uniforms.get(
        self
          .layout
          .uniforms
          .get("projection")
          .expect("Missing \"projection\" uniform."),
      ),
      false,
      &self.projection,
    );

    // // The viewport is a rendered in physical pixels. It's intentional to use
    // // the camera dimensions instead of canvas dimensions since the camera often
    // // exceeds the canvas and the viewport's dimensions must be an integer
    // // multiple of the camera. The negative consequence is that the first pixel
    // // on the y-axis and last pixel on the x-axis may be partly truncated.
    self.gl.viewport(
      0,
      0,
      (scale * cam.width())
        .to_i32()
        .expect("Cam width i16 to i32 conversion failed."),
      (scale * cam.height())
        .to_i32()
        .expect("Cam height i16 to i32 conversion failed."),
    );
  }

  #[rustfmt::skip]
  fn project_through(&mut self, cam: &R16) {
    // Convert the pixels to clipspace by taking them as a fraction of the cam
    // resolution, scaling to 0-2, flipping the y-coordinate so that positive y
    // is downward, and translating to -1 to 1 and again by the camera position.
    let w = 2. / f32::from(cam.width());
    let h = 2. / f32::from(cam.height());
    self.projection[ 0] = w;  self.projection[ 1] =  0.; self.projection[ 2] = 0.; self.projection[ 3] = -1. - f32::from(cam.from.x) * w;
    self.projection[ 4] = 0.; self.projection[ 5] = -h;  self.projection[ 6] = 0.; self.projection[ 7] =  1. + f32::from(cam.from.y) * h;
    self.projection[ 8] = 0.; self.projection[ 9] =  0.; self.projection[10] = 1.; self.projection[11] =  0.;
    self.projection[12] = 0.; self.projection[13] =  0.; self.projection[14] = 0.; self.projection[15] =  1.;
  }
}
