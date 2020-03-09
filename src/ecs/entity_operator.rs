use specs::prelude::DenseVecStorage;
use specs::Component;

#[derive(Component, Clone, Copy, Debug, Deserialize, PartialEq)]
pub enum EntityOperator {
  Computer,
  Player,
}
