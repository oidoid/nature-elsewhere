use super::lerp::Lerp;
use num::{
  integer::Roots,
  traits::{cast::NumCast, clamp, Signed},
};
use serde::Serialize;
use std::{
  fmt,
  ops::{Add, AddAssign, Div, Mul, Sub},
};

#[derive(Clone, Eq, PartialEq, Serialize)]
pub struct XY<T: Default> {
  pub x: T,
  pub y: T,
}
pub type XY16 = XY<i16>;

// impl<T, Into: NumCast> From<XY<T>> for XY<Into> {
//   fn from(XY { x, y }: T) -> XY<Into> {
//     XY { x: Into::from(x).unwrap(), y: Into::from(y).unwrap() }
//   }
// }
// impl NumCast's from and return an option self?

impl<T: Default> XY<T> {
  pub fn new(x: T, y: T) -> Self {
    Self { x, y }
  }

  pub fn add(&self, rhs: &XY<T>) -> XY<T>
  where
    T: Add<Output = T> + Copy,
  {
    Self { x: self.x + rhs.x, y: self.y + rhs.y }
  }

  /// Cast each component passed and returns a new XY. Cast::from() differs from
  /// From::from() in that it may fail.
  pub fn cast<From>(x: From, y: From) -> Self
  where
    T: NumCast,
    From: NumCast,
  {
    Self { x: T::from(x).unwrap(), y: T::from(y).unwrap() }
  }

  /// Cast each component of self and returns a new XY.
  pub fn into<Into: NumCast + Default>(self) -> XY<Into>
  where
    T: NumCast,
    Into: NumCast,
  {
    XY { x: Into::from(self.x).unwrap(), y: Into::from(self.y).unwrap() }
  }

  /// Returns a new XY with equal x and y components.
  pub fn square(component: T) -> Self
  where
    T: Copy,
  {
    Self { x: component, y: component }
  }

  pub fn area(self) -> T
  where
    T: Mul<Output = T>,
  {
    self.x * self.y
  }

  pub fn min(&self, &XY { x, y }: &Self) -> Self
  where
    T: Ord + Copy,
  {
    Self { x: self.x.min(x), y: self.y.min(y) }
  }

  pub fn max(&self, &XY { x, y }: &Self) -> Self
  where
    T: Ord + Copy,
  {
    Self { x: self.x.max(x), y: self.y.max(y) }
  }

  pub fn clamp(&self, min: &Self, max: &Self) -> Self
  where
    T: PartialOrd + Copy,
  {
    Self { x: clamp(self.x, min.x, max.x), y: clamp(self.y, min.y, max.y) }
  }

  pub fn abs(&self) -> Self
  where
    T: Signed,
  {
    Self { x: self.x.abs(), y: self.y.abs() }
  }

  // pub fn to_ne_bytes(self) -> [u8; mem::size_of::<Self>()] {
  //   unsafe { mem::transmute(self) }
  // }
}

macro_rules! impl_magnitude {
  ($($t:ty)*) => ($(
    impl XY<$t> {
      /// Returns the length.
      pub fn magnitude(&self) -> $t {
        (self.x * self.x + self.y * self.y).sqrt()
      }
    }
  )*)
}
impl_magnitude!(usize isize u8 i8 u16 i16 u32 i32 f32 u64 i64 f64 u128 i128);

macro_rules! impl_lerp {
  ($ratio:ty, $($t:ty)*) => ($(
    impl XY<$t> {
      pub fn lerp(&self, to: &Self, ratio: $ratio) -> Self {
        Self { x: self.x.lerp(to.x, ratio), y: self.y.lerp(to.y, ratio) }
      }
    }
  )*)
}
impl_lerp!(f32, u8 i8 u16 i16 f32);
impl_lerp!(f64, u32 i32 f64);

impl<T: fmt::Debug + Default> fmt::Debug for XY<T> {
  fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(formatter, "({:?}, {:?})", self.x, self.y)
  }
}

impl<T: fmt::Display + Default> fmt::Display for XY<T> {
  fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(formatter, "({}, {})", self.x, self.y)
  }
}

impl<T: Add<Output = T> + Default> Add<XY<T>> for XY<T> {
  type Output = XY<T>;

  fn add(self, rhs: XY<T>) -> Self {
    Self { x: self.x + rhs.x, y: self.y + rhs.y }
  }
}

impl<T: AddAssign + Default + Clone> AddAssign<&XY<T>> for XY<T> {
  fn add_assign(&mut self, rhs: &XY<T>) {
    self.x += rhs.x.clone();
    self.y += rhs.y.clone();
  }
}

impl<T: Sub<Output = T> + Default> Sub<XY<T>> for XY<T> {
  type Output = XY<T>;

  fn sub(self, rhs: XY<T>) -> Self {
    Self { x: self.x - rhs.x, y: self.y - rhs.y }
  }
}

impl<T: Mul<Output = T> + Default> Mul<XY<T>> for XY<T> {
  type Output = XY<T>;

  fn mul(self, rhs: XY<T>) -> Self {
    Self { x: self.x * rhs.x, y: self.y * rhs.y }
  }
}

impl<T: Mul<Output = T> + Clone + Default> Mul<T> for XY<T> {
  type Output = XY<T>;

  fn mul(self, rhs: T) -> Self {
    Self { x: self.x * rhs.clone(), y: self.y * rhs }
  }
}

impl<T: Div<Output = T> + Default> Div<XY<T>> for XY<T> {
  type Output = XY<T>;

  fn div(self, rhs: XY<T>) -> Self {
    Self { x: self.x / rhs.x, y: self.y / rhs.y }
  }
}

impl<T: Div<Output = T> + Copy + Default> Div<T> for XY<T> {
  type Output = XY<T>;

  fn div(self, rhs: T) -> Self {
    Self { x: self.x / rhs, y: self.y / rhs }
  }
}

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn cast() {
    assert_eq!(XY::cast(-1.2, -3.4), XY16 { x: -1, y: -3 })
  }

  #[test]
  fn into() {
    assert_eq!(XY { x: -1.2, y: -3.4 }.into(), XY16 { x: -1, y: -3 })
  }

  #[test]
  fn square() {
    assert_eq!(XY::square(1), XY16 { x: 1, y: 1 })
  }

  #[test]
  fn add() {
    assert_eq!(XY { x: 1, y: 2 } + XY { x: 3, y: 4 }, XY { x: 4, y: 6 })
  }

  #[test]
  fn sub() {
    assert_eq!(XY { x: 1, y: 2 } - XY { x: 3, y: 4 }, XY { x: -2, y: -2 })
  }

  #[test]
  fn mul_xy() {
    assert_eq!(XY { x: 1, y: 2 } * XY { x: 3, y: 4 }, XY { x: 3, y: 8 })
  }

  #[test]
  fn mul_scalar() {
    assert_eq!(XY { x: 1, y: 2 } * 3, XY { x: 3, y: 6 })
  }

  #[test]
  fn div_xy() {
    assert_eq!(XY { x: 3, y: 4 } / XY { x: 1, y: 2 }, XY { x: 3, y: 2 })
  }

  #[test]
  fn div_scalar() {
    assert_eq!(XY { x: 3, y: 4 } / 2, XY { x: 1, y: 2 })
  }

  #[test]
  fn area() {
    assert_eq!(XY { x: 10, y: 200 }.area(), 2000)
  }

  #[test]
  fn min() {
    [
      (XY { x: 1, y: 20 }, XY { x: 300, y: 4000 }, XY { x: 1, y: 20 }),
      (XY { x: 100, y: 20 }, XY { x: 3, y: 4000 }, XY { x: 3, y: 20 }),
      (XY { x: 1, y: 2000 }, XY { x: 300, y: 40 }, XY { x: 1, y: 40 }),
      (XY { x: 100, y: 2000 }, XY { x: 3, y: 40 }, XY { x: 3, y: 40 }),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, (lhs, rhs, expected))| {
      assert_eq!(
        lhs.min(rhs),
        *expected,
        "Case {} failed: {:?}.",
        i,
        (lhs, rhs, expected)
      )
    })
  }

  #[test]
  fn max() {
    [
      (XY { x: 1, y: 20 }, XY { x: 300, y: 4000 }, XY { x: 300, y: 4000 }),
      (XY { x: 100, y: 20 }, XY { x: 3, y: 4000 }, XY { x: 100, y: 4000 }),
      (XY { x: 1, y: 2000 }, XY { x: 300, y: 40 }, XY { x: 300, y: 2000 }),
      (XY { x: 100, y: 2000 }, XY { x: 3, y: 40 }, XY { x: 100, y: 2000 }),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, (lhs, rhs, expected))| {
      assert_eq!(
        lhs.max(rhs),
        *expected,
        "Case {} failed: {:?}.",
        i,
        (lhs, rhs, expected)
      )
    })
  }

  #[test]
  fn clamp() {
    [
      (
        XY { x: 10, y: 200 },
        XY { x: 11, y: 201 },
        XY { x: 1000, y: 1000 },
        XY { x: 11, y: 201 },
      ),
      (
        XY { x: 10, y: 200 },
        XY { x: 0, y: 0 },
        XY { x: 1000, y: 1000 },
        XY { x: 10, y: 200 },
      ),
      (
        XY { x: 10, y: 200 },
        XY { x: 0, y: 0 },
        XY { x: 9, y: 199 },
        XY { x: 9, y: 199 },
      ),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, (val, min, max, expected))| {
      assert_eq!(
        val.clamp(min, max),
        *expected,
        "Case {} failed: {:?}.",
        i,
        (val, min, max, expected)
      )
    })
  }

  #[test]
  pub fn abs_neg() {
    assert_eq!(XY { x: -1, y: -2 }.abs(), XY { x: 1, y: 2 })
  }

  #[test]
  pub fn abs_mix() {
    assert_eq!(XY { x: -1, y: 2 }.abs(), XY { x: 1, y: 2 })
  }

  #[test]
  pub fn abs_pos() {
    assert_eq!(XY { x: 1, y: 2 }.abs(), XY { x: 1, y: 2 })
  }

  #[test]
  pub fn magnitude_int() {
    assert_eq!(XY16 { x: 3, y: 4 }.magnitude(), 5)
  }

  #[test]
  pub fn magnitude_int_trunc() {
    assert_eq!(XY16 { x: 2, y: 2 }.magnitude(), 2)
  }

  #[test]
  pub fn magnitude_float() {
    assert_eq!(XY { x: 3f32, y: 4. }.magnitude(), 5.)
  }

  #[test]
  pub fn lerp_int() {
    assert_eq!(
      XY16 { x: 1, y: 2 }.lerp(&XY { x: 3, y: 4 }, 0.5),
      XY { x: 2, y: 3 }
    )
  }

  #[test]
  pub fn lerp_float() {
    assert_eq!(
      XY { x: 1f64, y: 2. }.lerp(&XY { x: 3., y: 4. }, 0.5),
      XY { x: 2., y: 3. }
    )
  }
}
