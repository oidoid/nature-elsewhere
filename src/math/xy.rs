use std::ops::{Add, Div, Mul, Sub};

#[derive(Debug, Eq, PartialEq)]
pub struct XY<T> {
  pub x: T,
  pub y: T,
}
pub type XY16 = XY<i16>;

impl<T: Copy> XY<T> {
  // [todo] cast.

  /// Returns a new XY with equal x and y components.
  pub fn diagonal(component: T) -> Self {
    XY { x: component, y: component }
  }
}

impl<T: Add<Output = T>> Add<XY<T>> for XY<T> {
  type Output = XY<T>;
  fn add(self, rhs: XY<T>) -> Self::Output {
    XY { x: self.x + rhs.x, y: self.y + rhs.y }
  }
}

impl<T: Sub<Output = T>> Sub<XY<T>> for XY<T> {
  type Output = XY<T>;
  fn sub(self, rhs: XY<T>) -> Self::Output {
    XY { x: self.x - rhs.x, y: self.y - rhs.y }
  }
}

impl<T: Mul<Output = T>> Mul<XY<T>> for XY<T> {
  type Output = XY<T>;
  fn mul(self, rhs: XY<T>) -> Self::Output {
    XY { x: self.x * rhs.x, y: self.y * rhs.y }
  }
}

impl<T: Div<Output = T>> Div<XY<T>> for XY<T> {
  type Output = XY<T>;
  fn div(self, rhs: XY<T>) -> Self::Output {
    XY { x: self.x / rhs.x, y: self.y / rhs.y }
  }
}

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn diagonal() {
    assert_eq!(XY::diagonal(1), XY16 { x: 1, y: 1 });
  }

  #[test]
  fn add() {
    assert_eq!(XY { x: 1, y: 2 } + XY { x: 3, y: 4 }, XY { x: 4, y: 6 });
  }

  #[test]
  fn sub() {
    assert_eq!(XY { x: 1, y: 2 } - XY { x: 3, y: 4 }, XY { x: -2, y: -2 });
  }

  #[test]
  fn mul() {
    assert_eq!(XY { x: 1, y: 2 } * XY { x: 3, y: 4 }, XY { x: 3, y: 8 });
  }

  #[test]
  fn div() {
    assert_eq!(XY { x: 3, y: 4 } / XY { x: 1, y: 2 }, XY { x: 3, y: 2 });
  }
}
