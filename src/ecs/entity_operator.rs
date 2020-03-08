use specs::prelude::DenseVecStorage;
use specs::Component;

#[derive(Component, Clone)]
pub enum EntityOperator {
  Computer,
  Player,
}
