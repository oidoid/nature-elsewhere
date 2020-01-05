use super::shader_layout::Attribute;
use num_traits::cast::FromPrimitive;
use std::collections::HashMap;
use wasm_bindgen::prelude::JsValue;
use wasm_bindgen::JsCast;
use web_sys::{
  console, AngleInstancedArrays, HtmlCanvasElement, HtmlImageElement,
  WebGlBuffer as GlBuffer, WebGlProgram as GlProgram,
  WebGlRenderingContext as Gl, WebGlShader as GlShader,
  WebGlTexture as GlTexture, WebGlUniformLocation as GlUniformLocation,
};

pub fn get_context(canvas: &HtmlCanvasElement) -> Gl {
  canvas.get_context("webgl").unwrap().unwrap().dyn_into::<Gl>().unwrap()
}

pub fn init_attr(
  gl: &Gl,
  instanced_arrays: AngleInstancedArrays,
  stride: i32,
  divisor: u32,
  buffer: Option<&GlBuffer>,
  location: u32,
  Attribute { data_type, length, offset, .. }: Attribute,
) {
  gl.enable_vertex_attrib_array(location);
  gl.bind_buffer(Gl::ARRAY_BUFFER, buffer);
  gl.vertex_attrib_pointer_with_i32(
    location,
    length,
    data_type as u32,
    false,
    stride,
    offset,
  );
  instanced_arrays.vertex_attrib_divisor_angle(location, divisor);
  gl.bind_buffer(Gl::ARRAY_BUFFER, None);
}

pub fn load_program(
  gl: &Gl,
  vertex_glsl: String,
  fragment_glsl: String,
) -> Option<GlProgram> {
  let pgm = match gl.create_program() {
    None => return None,
    Some(pgm) => pgm,
  };

  let vertex_shader = compile_shader(gl, Gl::VERTEX_SHADER, vertex_glsl);
  let fragment_shader = compile_shader(gl, Gl::FRAGMENT_SHADER, fragment_glsl);
  gl.attach_shader(&pgm, &vertex_shader);
  gl.attach_shader(&pgm, &fragment_shader);
  gl.link_program(&pgm);
  gl.use_program(Some(&pgm));

  if let Some(log) = gl.get_program_info_log(&pgm) {
    console::log_1(&JsValue::from(log));
  }

  // Mark shaders for deletion when unused.
  gl.detach_shader(&pgm, &fragment_shader);
  gl.detach_shader(&pgm, &vertex_shader);
  gl.delete_shader(Some(&fragment_shader));
  gl.delete_shader(Some(&vertex_shader));

  Some(pgm)
}

pub fn compile_shader(gl: &Gl, glsl_type: u32, source: String) -> GlShader {
  let shader = gl.create_shader(glsl_type).expect("Shader creation failed.");
  gl.shader_source(&shader, source.trim());
  gl.compile_shader(&shader);

  if let Some(log) = gl.get_shader_info_log(&shader) {
    console::log_1(&JsValue::from(log));
  }

  shader
}

pub fn buffer_data(gl: Gl, buffer: Option<&GlBuffer>, data: &[u8], usage: u32) {
  gl.bind_buffer(Gl::ARRAY_BUFFER, buffer);
  gl.buffer_data_with_u8_array(Gl::ARRAY_BUFFER, data, usage);
  gl.bind_buffer(Gl::ARRAY_BUFFER, None);
}

pub fn load_texture(
  gl: &Gl,
  texture_unit: u32,
  image: &HtmlImageElement,
) -> Option<GlTexture> {
  gl.active_texture(texture_unit);
  let texture = gl.create_texture();
  gl.bind_texture(Gl::TEXTURE_2D, texture.as_ref());
  gl.tex_parameteri(Gl::TEXTURE_2D, Gl::TEXTURE_MIN_FILTER, Gl::NEAREST as i32);
  gl.tex_parameteri(Gl::TEXTURE_2D, Gl::TEXTURE_MAG_FILTER, Gl::NEAREST as i32);
  if let Err(err) = gl.tex_image_2d_with_u32_and_u32_and_image(
    Gl::TEXTURE_2D,
    0,
    Gl::RGBA as i32,
    Gl::RGBA,
    Gl::UNSIGNED_BYTE,
    image,
  ) {
    println!("Failed to load image. Error code {}.", err.as_f64().unwrap())
  }
  gl.bind_texture(Gl::TEXTURE_2D, None);
  texture
}

pub fn uniform_locations(
  gl: &Gl,
  pgm: Option<&GlProgram>,
) -> HashMap<String, GlUniformLocation> {
  let pgm = match pgm {
    None => return HashMap::new(),
    Some(pgm) => pgm,
  };
  let len = u32::from_f64(
    gl.get_program_parameter(pgm, Gl::ACTIVE_UNIFORMS).as_f64().unwrap_or(0.),
  )
  .unwrap();
  let mut locations = HashMap::new();
  for i in 0..len {
    if let Some(uniform) = gl.get_active_uniform(pgm, i) {
      let name = uniform.name();
      if let Some(location) = gl.get_uniform_location(pgm, &name) {
        locations.insert(name, location);
      }
    }
  }
  locations
}

pub fn attr_locations(
  gl: &Gl,
  pgm: Option<&GlProgram>,
) -> HashMap<String, u32> {
  let pgm = match pgm {
    None => return HashMap::new(),
    Some(pgm) => pgm,
  };
  let len = u32::from_f64(
    gl.get_program_parameter(pgm, Gl::ACTIVE_ATTRIBUTES).as_f64().unwrap_or(0.),
  )
  .unwrap();
  let mut locations = HashMap::new();
  for i in 0..len {
    if let Some(attr) = gl.get_active_attrib(pgm, i) {
      let name = attr.name();
      let location = gl.get_attrib_location(pgm, &name);
      if location != -1 {
        locations.insert(name, location as u32);
      }
    }
  }
  locations
}
