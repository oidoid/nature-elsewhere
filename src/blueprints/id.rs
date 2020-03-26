use std::cmp::Ord;
use std::fmt;

#[derive(
  Clone, Copy, Deserialize, PartialEq, Eq, Hash, Serialize, PartialOrd, Ord,
)]
pub enum ID {
  Bee,
  RainCloud,
  Button,
  SaveDialog,
  Cursor,
  Map,
}

impl fmt::Display for ID {
  fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(formatter, "{}", self)
  }
}

impl ID {
  pub fn blueprint_filename(&self) -> String {
    let name = match self {
      Bee => "bee",
      RainCloud => "rain_cloud",
      Button => "button",
      SaveDialog => "save_dialog",
      Cursor => "cursor",
      Map => "map",
    };
    format!("/blueprints/{}.json", name)
  }
}
