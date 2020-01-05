use image::DynamicImage;

pub fn load(memory: &[u8]) -> DynamicImage {
  image::load_from_memory(memory).expect("Failed to load image.")
}
