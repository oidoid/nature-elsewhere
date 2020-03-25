use specs::prelude::DenseVecStorage;
use specs::Component;

#[serde(deny_unknown_fields)]
#[derive(Component, Deserialize)]
pub struct Player;
