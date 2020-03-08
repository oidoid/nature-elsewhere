use specs::prelude::DenseVecStorage;
use specs::Component;

#[derive(Component, Clone)]
pub struct State {} // this is for determining what animation to show

// there are cases where non-i16 xy are useful.
