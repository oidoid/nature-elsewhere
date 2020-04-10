use super::Sprite;
use crate::manufacturer::SpriteBlueprint;
use std::collections::HashMap;

pub type State = String;

/// All SpriteMaps implement this state.
// pub static DEFAULT_STATE: State = "Default".to_string();
// Do I want a hidden state?

pub struct SpriteMap<'a> {
  pub state: State,
  // todo: we'll have to see how this goes reconstructing the entire state every
  // time the state changes.
  pub sprites: Vec<Sprite>, // this becomes a sprite_layout.

  // actually don't want a a vec since it's assembled on the fly.
  // pub sprites: HashMap<State, Vec<Sprite>>,
  pub sprite_blueprints: &'a HashMap<String, Vec<SpriteBlueprint>>,
}

impl<'a> SpriteMap<'a> {
  /// Sets the Default state.
  pub fn new(
    state: State,
    sprite_blueprints: &'a HashMap<String, Vec<SpriteBlueprint>>,
  ) -> Self {
    // let mut sprites = HashMap::new();
    // sprites.insert(DEFAULT_STATE, vec![]);
    // invalideate
    let sprites = vec![];
    Self { state, sprites, sprite_blueprints }
  }

  /// Returns the active state.
  pub fn get_state(&self) -> &State {
    &self.state
  }

  pub fn get_states(&self) -> Vec<&State> {
    self.sprite_blueprints.keys().collect()
  }

  /// Transitions the active state as needed.
  pub fn set_state(&mut self, state: State) {
    if self.state == state {
      return;
    }
    assert_eq!(self.sprite_blueprints.contains_key(&state), true);
    self.state = state;
  }

  /// Returns sprites for the active state.
  pub fn get_sprites(&self) -> &Vec<Sprite> {
    &self.sprites
  }
}
