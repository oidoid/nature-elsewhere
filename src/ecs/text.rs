use crate::math::rect::R16;
use crate::math::xy::XY16;
use crate::sprites::sprite_composition::SpriteComposition;
use crate::sprites::sprite_layer::SpriteLayer;
use specs::prelude::DenseVecStorage;
use specs::Component;

#[derive(Component)]
pub struct Text(String);
