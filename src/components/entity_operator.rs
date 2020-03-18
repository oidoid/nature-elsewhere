use specs::prelude::DenseVecStorage;
use specs::Component;

#[derive(Component)]
pub enum EntityOperator {
  Computer,
  Player,
}