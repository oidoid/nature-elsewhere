use specs::prelude::DenseVecStorage;
use specs::Component;

#[serde(deny_unknown_fields)]
#[derive(Component, Clone, Deserialize)]
pub struct State {} // this is for determining what animation to show

// there are cases where non-i16 xy are useful.
