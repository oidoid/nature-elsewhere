use num::traits::cast::NumCast;
use std::{
  fmt,
  ops::{Add, Div, Mul, Sub},
};

/// Width and height (size or area). Rects and XY are generally preferred unless
/// just an area is needed.
#[derive(Clone, Eq, PartialEq)]
pub struct WH<T> {
  pub w: T,
  pub h: T,
}
pub type WH16 = WH<i16>;

impl<T> WH<T> {
  pub fn new(w: T, h: T) -> Self {
    Self { w, h }
  }

  /// Cast each component passed and returns a new WH.
  pub fn from<From>(w: From, h: From) -> Self
  where
    T: NumCast,
    From: NumCast,
  {
    Self {
      w: T::from(w).expect(&format!(
        "Conversion from {} to {} failed.",
        stringify!(From),
        stringify!(T)
      )),
      h: T::from(h).expect(&format!(
        "Conversion from {} to {} failed.",
        stringify!(From),
        stringify!(T)
      )),
    }
  }

  /// Cast each component of self and returns a new WH.
  pub fn into<Into>(self) -> WH<Into>
  where
    T: NumCast,
    Into: NumCast,
  {
    WH {
      w: Into::from(self.w).expect(&format!(
        "Conversion from {} to {} failed.",
        stringify!(T),
        stringify!(Into)
      )),
      h: Into::from(self.h).expect(&format!(
        "Conversion from {} to {} failed.",
        stringify!(T),
        stringify!(Into)
      )),
    }
  }

  /// Returns a new WH with equal w and h components.
  pub fn square(side: T) -> Self
  where
    T: Copy,
  {
    Self { w: side, h: side }
  }

  pub fn area(&self) -> T
  where
    T: Mul<Output = T> + Copy,
  {
    self.w * self.h
  }
}

impl<T: fmt::Debug> fmt::Debug for WH<T> {
  fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(formatter, "({:?}, {:?})", self.w, self.h)
  }
}

impl<T: fmt::Display> fmt::Display for WH<T> {
  fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(formatter, "({}, {})", self.w, self.h)
  }
}

impl<T: Add<Output = T>> Add<WH<T>> for WH<T> {
  type Output = Self;

  fn add(self, rhs: Self) -> Self {
    Self { w: self.w + rhs.w, h: self.h + rhs.h }
  }
}

impl<T: Sub<Output = T>> Sub<WH<T>> for WH<T> {
  type Output = Self;

  fn sub(self, rhs: Self) -> Self {
    Self { w: self.w - rhs.w, h: self.h - rhs.h }
  }
}

impl<T: Mul<Output = T>> Mul<WH<T>> for WH<T> {
  type Output = Self;

  fn mul(self, rhs: Self) -> Self {
    Self { w: self.w * rhs.w, h: self.h * rhs.h }
  }
}

impl<T: Mul<Output = T> + Copy> Mul<T> for WH<T> {
  type Output = Self;

  fn mul(self, rhs: T) -> Self {
    Self { w: self.w * rhs, h: self.h * rhs }
  }
}

impl<T: Div<Output = T>> Div<WH<T>> for WH<T> {
  type Output = Self;

  fn div(self, rhs: Self) -> Self {
    Self { w: self.w / rhs.w, h: self.h / rhs.h }
  }
}

impl<T: Div<Output = T> + Copy> Div<T> for WH<T> {
  type Output = Self;

  fn div(self, rhs: T) -> Self {
    Self { w: self.w / rhs, h: self.h / rhs }
  }
}

impl<T: Default> Default for WH<T> {
  fn default() -> Self {
    WH { w: T::default(), h: T::default() }
  }
}

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn from() {
    assert_eq!(WH::from(1.2, 3.4), WH16 { w: 1, h: 3 })
  }

  #[test]
  fn into() {
    assert_eq!(WH { w: 1.2, h: 3.4 }.into(), WH16 { w: 1, h: 3 })
  }

  #[test]
  fn square() {
    assert_eq!(WH::square(1), WH16 { w: 1, h: 1 })
  }

  #[test]
  fn add() {
    assert_eq!(WH { w: 1, h: 2 } + WH { w: 3, h: 4 }, WH { w: 4, h: 6 })
  }

  #[test]
  fn sub() {
    assert_eq!(WH { w: 1, h: 2 } - WH { w: 3, h: 4 }, WH { w: -2, h: -2 })
  }

  #[test]
  fn mul_wh() {
    assert_eq!(WH { w: 1, h: 2 } * WH { w: 3, h: 4 }, WH { w: 3, h: 8 })
  }

  #[test]
  fn mul_scalar() {
    assert_eq!(WH { w: 1, h: 2 } * 3, WH { w: 3, h: 6 })
  }

  #[test]
  fn div_wh() {
    assert_eq!(WH { w: 3, h: 4 } / WH { w: 1, h: 2 }, WH { w: 3, h: 2 })
  }

  #[test]
  fn div_scalar() {
    assert_eq!(WH { w: 3, h: 4 } / 2, WH { w: 1, h: 2 })
  }

  #[test]
  fn area() {
    assert_eq!(WH { w: 10, h: 200 }.area(), 2000)
  }
}
