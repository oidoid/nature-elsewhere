#[derive(Debug, Deserialize, Eq, PartialEq)]
pub struct WH<T> {
  pub w: T,
  pub h: T,
}
pub type WH16 = WH<u16>;
