use super::shader_layout::Attribute;
use image::{DynamicImage, GenericImageView};
use num::traits::cast::FromPrimitive;
use num::traits::cast::ToPrimitive;
use std::collections::HashMap;
use std::convert::From;
use wasm_bindgen::{prelude::JsValue, JsCast};
use web_sys::{
  console, AngleInstancedArrays, HtmlCanvasElement, WebGlBuffer as GlBuffer,
  WebGlContextAttributes as GlContextAttributes, WebGlProgram as GlProgram,
  WebGlRenderingContext as Gl, WebGlShader as GlShader,
  WebGlTexture as GlTexture, WebGlUniformLocation as GlUniformLocation,
};

pub fn get_context(
  canvas: &HtmlCanvasElement,
  options: &GlContextAttributes,
) -> Result<Gl, JsValue> {
  Ok(
    canvas
      .get_context_with_context_options("webgl", options.as_ref())?
      .unwrap()
      .dyn_into()?,
  )
}

pub fn init_attr(
  gl: &Gl,
  instanced_arrays: &AngleInstancedArrays,
  stride: i32,
  divisor: u32,
  buffer: Option<&GlBuffer>,
  location: u32,
  &Attribute { data_type, len, offset, .. }: &Attribute,
) {
  gl.enable_vertex_attrib_array(location);
  gl.bind_buffer(Gl::ARRAY_BUFFER, buffer);
  gl.vertex_attrib_pointer_with_i32(
    location,
    len,
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
  vert_glsl: &str,
  frag_glsl: &str,
) -> Option<GlProgram> {
  let pgm = gl.create_program()?;
  let vertex_shader = compile_shader(gl, Gl::VERTEX_SHADER, vert_glsl);
  let fragment_shader = compile_shader(gl, Gl::FRAGMENT_SHADER, frag_glsl);

  if let Some(log) = gl.get_program_info_log(&pgm) {
    if !log.is_empty() {
      console::log_1(&JsValue::from(log));
    }
  }

  let vertex_shader = vertex_shader?;
  let fragment_shader = fragment_shader?;
  gl.attach_shader(&pgm, &vertex_shader);
  gl.attach_shader(&pgm, &fragment_shader);
  gl.link_program(&pgm);
  gl.use_program(Some(&pgm));

  // Mark shaders for deletion when unused.
  gl.detach_shader(&pgm, &fragment_shader);
  gl.detach_shader(&pgm, &vertex_shader);
  gl.delete_shader(Some(&fragment_shader));
  gl.delete_shader(Some(&vertex_shader));

  Some(pgm)
}

pub fn compile_shader(
  gl: &Gl,
  glsl_type: u32,
  source: &str,
) -> Option<GlShader> {
  let shader = gl.create_shader(glsl_type)?;
  gl.shader_source(&shader, source.trim());
  gl.compile_shader(&shader);

  if let Some(log) = gl.get_shader_info_log(&shader) {
    if !log.is_empty() {
      console::log_1(&JsValue::from(log));
    }
  }

  Some(shader)
}

pub fn buffer_data(
  gl: &Gl,
  buffer: Option<&GlBuffer>,
  data: &[u8],
  usage: u32,
) {
  gl.bind_buffer(Gl::ARRAY_BUFFER, buffer);
  gl.buffer_data_with_u8_array(Gl::ARRAY_BUFFER, data, usage);
  gl.bind_buffer(Gl::ARRAY_BUFFER, None);
}

pub fn load_texture(
  gl: &Gl,
  texture_unit: u32,
  image: &DynamicImage,
) -> Option<GlTexture> {
  gl.active_texture(texture_unit);
  let texture = gl.create_texture();
  gl.bind_texture(Gl::TEXTURE_2D, texture.as_ref());
  gl.tex_parameteri(Gl::TEXTURE_2D, Gl::TEXTURE_MIN_FILTER, Gl::NEAREST as i32);
  gl.tex_parameteri(Gl::TEXTURE_2D, Gl::TEXTURE_MAG_FILTER, Gl::NEAREST as i32);
  if let Err(err) = gl
    .tex_image_2d_with_i32_and_i32_and_i32_and_format_and_type_and_opt_u8_array(
      Gl::TEXTURE_2D,
      0,
      Gl::RGBA as i32,
      image.width().to_i32().expect("Width u32 to i32 conversion failed."),
      image.height().to_i32().expect("Height u32 to i32 conversion failed."),
      0,
      Gl::RGBA,
      Gl::UNSIGNED_BYTE,
      Some(&image.to_rgba().to_vec()),
    )
  {
    println!("Failed to load image. Error code {}.", err.as_f64()?)
  }
  gl.bind_texture(Gl::TEXTURE_2D, None);
  texture
}

pub fn uniform_locations(
  gl: &Gl,
  pgm: &GlProgram,
) -> Option<HashMap<String, GlUniformLocation>> {
  let len = u32::from_f64(
    gl.get_program_parameter(pgm, Gl::ACTIVE_UNIFORMS).as_f64()?,
  )?;
  let mut locations = HashMap::new();
  for i in 0..len {
    let uniform = gl.get_active_uniform(pgm, i)?;
    let name = uniform.name();
    let location = gl.get_uniform_location(pgm, &name)?;
    locations.insert(name, location);
  }
  Some(locations)
}

pub fn attr_locations(
  gl: &Gl,
  pgm: &GlProgram,
) -> Option<HashMap<String, u32>> {
  let len = u32::from_f64(
    gl.get_program_parameter(pgm, Gl::ACTIVE_ATTRIBUTES).as_f64()?,
  )?;
  let mut locations = HashMap::new();
  for i in 0..len {
    let attr = gl.get_active_attrib(pgm, i)?;
    let name = attr.name();
    let location = gl.get_attrib_location(pgm, &name);
    if location != -1 {
      locations.insert(name, location as u32);
    }
  }
  Some(locations)
}
