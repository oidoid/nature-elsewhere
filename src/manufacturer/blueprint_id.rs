use serde::{Deserialize, Serialize};
use std::cmp::Ord;
use std::fmt;
use strum_macros::EnumIter;

/// Identifier for defining and referencing Blueprints.
#[derive(
  Clone,
  Copy,
  Deserialize,
  PartialEq,
  Eq,
  Hash,
  Serialize,
  PartialOrd,
  Ord,
  EnumIter,
)]
pub enum BlueprintID {
  Bee,
  RainCloud,
  Button,
  SaveDialog,
  Cursor,
  Map,
  Fruit,
  AppleTree,
  Item,
  Backpacker,
  Bunny,
  Fly,
  Flower,
  Frog,
  Pig,
  Snake,
  Group,
  LevelEditorSandbox,
  Bush,
  Cattails,
  Cloud,
  Clover,
  Compartment,
  Conifer,
  Flag,
  Grass,
  Monument,
  Mountain,
  Path,
  Plane,
  Pond,
  Subshrub,
  Tree,
  UIButton,
  LifeCounter,
  NinePatch,
  PlayerStatus,
  UICheckbox,
  UICursor,
  UICursorDot,
  UICursorHand,
  UICursorReticle,
  UIDateVersionHash,
  UIDestinationMarker,
  UIEntityPicker,
  UILevelEditorPanelMenu,
  UILevelEditorPanel,
  UILevelEditorPanelBackground,
  UILevelLink,
  UIMarquee,
  UIRadioCheckboxGroup,
  UIText,
  UIToolbar,
}

pub static UI_KEY_PREFIX: &str = "UI";

impl fmt::Display for BlueprintID {
  fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(formatter, "{}", self)
  }
}
