use crate::math::WH16;
use specs::prelude::DenseVecStorage;
use specs::Component;

#[derive(Component)]
pub struct MaxWH(pub WH16);
