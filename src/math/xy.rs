use super::{lerp, TryLerp};
use num::{
  integer::Roots,
  traits::{
    cast::{NumCast, ToPrimitive},
    clamp,
    real::Real,
    Signed,
  },
};
use serde::Serialize;
use std::{
  convert::{From, TryFrom, TryInto},
  fmt,
  num::{
    NonZeroI128, NonZeroI16, NonZeroI32, NonZeroI64, NonZeroI8, NonZeroIsize,
    NonZeroU128, NonZeroU16, NonZeroU32, NonZeroU64, NonZeroU8, NonZeroUsize,
  },
  ops::{Add, AddAssign, Div, DivAssign, Mul, MulAssign, Sub, SubAssign},
};

#[derive(Clone, Eq, PartialEq, Serialize)]
pub struct XY<T> {
  pub x: T,
  pub y: T,
}
pub type XY16 = XY<i16>;
pub type XYU16 = XY<u16>;
pub type XY32 = XY<i32>;

impl<T> XY<T> {
  pub fn new(x: T, y: T) -> Self {
    Self { x, y }
  }

  /// Cast each argument returns a new XY.
  pub fn cast_from<From>(x: From, y: From) -> Option<Self>
  where
    T: NumCast,
    From: ToPrimitive,
  {
    Some(Self { x: T::from(x)?, y: T::from(y)? })
  }

  /// Cast each component of self and returns a new XY.
  pub fn cast_into<Into>(self) -> Option<XY<Into>>
  where
    T: ToPrimitive,
    Into: NumCast,
  {
    Some(XY { x: Into::from(self.x)?, y: Into::from(self.y)? })
  }

  /// Returns a new XY with equal x and y components.
  pub fn square(side: T) -> Self
  where
    T: Clone,
  {
    Self { x: side.clone(), y: side }
  }

  /// May be negative.
  pub fn area(&self) -> T
  where
    T: Mul<Output = T> + Clone,
  {
    self.x.clone() * self.y.clone()
  }

  pub fn min(&self, XY { x, y }: &Self) -> Self
  where
    T: Ord + Clone,
  {
    Self { x: self.x.clone().min(x.clone()), y: self.y.clone().min(y.clone()) }
  }

  pub fn max(&self, XY { x, y }: &Self) -> Self
  where
    T: Ord + Clone,
  {
    Self { x: self.x.clone().max(x.clone()), y: self.y.clone().max(y.clone()) }
  }

  pub fn clamp(&self, min: &Self, max: &Self) -> Self
  where
    T: PartialOrd + Clone,
  {
    Self {
      x: clamp(self.x.clone(), min.x.clone(), max.x.clone()),
      y: clamp(self.y.clone(), min.y.clone(), max.y.clone()),
    }
  }

  pub fn abs(&self) -> Self
  where
    T: Signed,
  {
    Self { x: self.x.abs(), y: self.y.abs() }
  }

  pub fn lerp(&self, to: &Self, ratio: T) -> Self
  where
    T: Real,
  {
    Self { x: lerp(self.x, to.x, ratio), y: lerp(self.y, to.y, ratio) }
  }
}

macro_rules! impl_magnitude {
  ($($T:ty),+) => ($(
    impl XY<$T> {
      /// Returns the length.
      pub fn magnitude(&self) -> $T {
        (self.x * self.x + self.y * self.y).sqrt()
      }
    }
  )+)
}
impl_magnitude!(
  usize, isize, u8, i8, u16, i16, u32, i32, f32, u64, i64, f64, u128, i128
);

macro_rules! impl_try_lerp {
  ($Ratio:ty; $($T:ty),+) => ($(
    impl XY<$T> {
      pub fn try_lerp(&self, to: &Self, ratio: $Ratio) -> Option<Self> {
        Some(Self {
          x: self.x.try_lerp(to.x, ratio)?, y: self.y.try_lerp(to.y, ratio)?
        })
      }
    }
  )+)
}
impl_try_lerp!(f32; u8, i8, u16, i16);
impl_try_lerp!(f64; u32, i32);

impl<T: fmt::Debug> fmt::Debug for XY<T> {
  fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(formatter, "({:?}, {:?})", self.x, self.y)
  }
}

impl<T: fmt::Display> fmt::Display for XY<T> {
  fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(formatter, "({}, {})", self.x, self.y)
  }
}

impl<T: Add<Output = T>> Add<XY<T>> for XY<T> {
  type Output = Self;
  fn add(self, rhs: Self) -> Self {
    Self { x: self.x + rhs.x, y: self.y + rhs.y }
  }
}

impl<T: AddAssign> AddAssign<XY<T>> for XY<T> {
  fn add_assign(&mut self, rhs: Self) {
    self.x += rhs.x;
    self.y += rhs.y;
  }
}

impl<T: Sub<Output = T>> Sub<XY<T>> for XY<T> {
  type Output = Self;
  fn sub(self, rhs: Self) -> Self {
    Self { x: self.x - rhs.x, y: self.y - rhs.y }
  }
}

impl<T: SubAssign> SubAssign<XY<T>> for XY<T> {
  fn sub_assign(&mut self, rhs: Self) {
    self.x -= rhs.x;
    self.y -= rhs.y;
  }
}

impl<T: Mul<Output = T>> Mul<XY<T>> for XY<T> {
  type Output = Self;
  fn mul(self, rhs: Self) -> Self {
    Self { x: self.x * rhs.x, y: self.y * rhs.y }
  }
}

impl<T: Mul<Output = T> + Clone> Mul<T> for XY<T> {
  type Output = Self;
  fn mul(self, rhs: T) -> Self {
    Self { x: self.x * rhs.clone(), y: self.y * rhs }
  }
}

impl<T: MulAssign> MulAssign<XY<T>> for XY<T> {
  fn mul_assign(&mut self, rhs: Self) {
    self.x *= rhs.x;
    self.y *= rhs.y;
  }
}

impl<T: MulAssign + Clone> MulAssign<T> for XY<T> {
  fn mul_assign(&mut self, rhs: T) {
    self.x *= rhs.clone();
    self.y *= rhs;
  }
}

impl<T: Div<Output = T>> Div<XY<T>> for XY<T> {
  type Output = Self;
  fn div(self, rhs: Self) -> Self {
    Self { x: self.x / rhs.x, y: self.y / rhs.y }
  }
}

impl<T: Div<Output = T> + Clone> Div<T> for XY<T> {
  type Output = Self;
  fn div(self, rhs: T) -> Self {
    Self { x: self.x / rhs.clone(), y: self.y / rhs }
  }
}

impl<T: DivAssign> DivAssign<XY<T>> for XY<T> {
  fn div_assign(&mut self, rhs: Self) {
    self.x /= rhs.x;
    self.y /= rhs.y;
  }
}

impl<T: DivAssign + Clone> DivAssign<T> for XY<T> {
  fn div_assign(&mut self, rhs: T) {
    self.x /= rhs.clone();
    self.y /= rhs;
  }
}

macro_rules! impl_From_to_float {
  ($To:ty; $($From:ty),+) => ($(
    impl From<XY<$From>> for XY<$To> {
      fn from(XY {x, y}: XY<$From>) -> Self {
        Self { x: From::from(x), y: From::from(y) }
      }
    }
    impl From<($From, $From)> for XY<$To> {
      fn from((x, y): ($From, $From)) -> Self {
        Self { x: From::from(x), y: From::from(y) }
      }
    }
)+)
}
impl_From_to_float!(f32; u8, i8, u16, i16);
impl_From_to_float!(f64; u8, i8, u16, i16, u32, i32, f32);

macro_rules! impl_TryFrom_float {
  ($From:ty; $($To:ty),+) => ($(
    impl TryFrom<XY<$From>> for XY<$To> {
      type Error = ();
      fn try_from(XY { x, y }: XY<$From>) -> Result<Self, Self::Error> {
        Ok(Self { x: NumCast::from(x).ok_or(())?, y: NumCast::from(y).ok_or(())? })
      }
    }
    impl TryFrom<($From, $From)> for XY<$To> {
      type Error = ();
      fn try_from((x, y): ($From, $From)) -> Result<Self, Self::Error> {
        Ok(Self { x: NumCast::from(x).ok_or(())?, y: NumCast::from(y).ok_or(())? })
      }
    }
  )+)
}
impl_TryFrom_float!(
  f32; usize,
  isize,
  u8,
  i8,
  u16,
  i16,
  u32,
  i32,
  u64,
  i64,
  u128,
  i128
);
impl_TryFrom_float!(
  f64; usize,
  isize,
  u8,
  i8,
  u16,
  i16,
  u32,
  i32,
  f32,
  u64,
  i64,
  u128,
  i128
);

macro_rules! impl_From_widen {
  ($From:ty; $($To:ty),+) => ($(
    impl From<XY<$From>> for XY<$To> {
      fn from(XY { x, y }: XY<$From>) -> Self {
        Self { x: x.into(), y: y.into() }
      }
    }
    impl From<($From, $From)> for XY<$To> {
      fn from((x, y): ($From, $From)) -> Self {
        Self { x: x.into(), y: y.into() }
      }
    }
  )+)
}
impl_From_widen!(u8; u16, i16, u32, i32, u64, i64, u128, i128);
impl_From_widen!(i8; i16, i32, i64, i128);
impl_From_widen!(u16; u32, i32, u64, i64, u128, i128);
impl_From_widen!(i16; i32, i64, i128);
impl_From_widen!(u32; u64, i64, u128, i128);
impl_From_widen!(i32; i64, i128);
impl_From_widen!(u64; u128, i128);
impl_From_widen!(i64; i128);

macro_rules! impl_TryFrom_int {
  ($From:ty; $($To:ty),+) => ($(
    impl TryFrom<XY<$From>> for XY<$To> {
      type Error = ();
      fn try_from(XY { x, y }: XY<$From>) -> Result<Self, Self::Error> {
        Ok(Self { x: x.try_into().map_err(|_| ())?, y: y.try_into().map_err(|_| ())? })
      }
    }
    impl TryFrom<($From, $From)> for XY<$To> {
      type Error = ();
      fn try_from((x, y): ($From, $From)) -> Result<Self, Self::Error> {
        Ok(Self { x: x.try_into().map_err(|_| ())?, y: y.try_into().map_err(|_| ())? })
      }
    }
  )+)
}
impl_TryFrom_int!(usize; isize, u8, i8, u16, i16, u32, i32, u64, i64, u128, i128);
impl_TryFrom_int!(isize; usize, u8, i8, u16, i16, u32, i32, u64, i64, u128, i128);
impl_TryFrom_int!(u8; usize, isize, i8);
impl_TryFrom_int!(i8; usize, isize, u8, u16, u32, u64, u128);
impl_TryFrom_int!(u16; usize, isize, u8, i8, i16);
impl_TryFrom_int!(i16; usize, isize, u8, i8, u16, u32, u64, u128);
impl_TryFrom_int!(u32; usize, isize, u8, i8, u16, i16, i32);
impl_TryFrom_int!(i32; usize, isize, u8, i8, u16, i16, u32, u64, u128);
impl_TryFrom_int!(u64; usize, isize, u8, i8, u16, i16, u32, i32, i64);
impl_TryFrom_int!(i64; usize, isize, u8, i8, u16, i16, u32, i32, u64, u128);
impl_TryFrom_int!(u128; usize, isize, u8, i8, u16, i16, u32, i32, u64, i64, i128);
impl_TryFrom_int!(i128; usize, isize, u8, i8, u16, i16, u32, i32, u64, i64, u128);

macro_rules! impl_From_non_zero_to_int {
  ($To:ty, $From:ty) => {
    impl From<XY<$From>> for XY<$To> {
      fn from(XY { x, y }: XY<$From>) -> Self {
        Self { x: x.get(), y: y.get() }
      }
    }
    impl From<($From, $From)> for XY<$To> {
      fn from((x, y): ($From, $From)) -> Self {
        Self { x: x.get(), y: y.get() }
      }
    }
  };
}
impl_From_non_zero_to_int!(usize, NonZeroUsize);
impl_From_non_zero_to_int!(isize, NonZeroIsize);
impl_From_non_zero_to_int!(u8, NonZeroU8);
impl_From_non_zero_to_int!(i8, NonZeroI8);
impl_From_non_zero_to_int!(u16, NonZeroU16);
impl_From_non_zero_to_int!(i16, NonZeroI16);
impl_From_non_zero_to_int!(u32, NonZeroU32);
impl_From_non_zero_to_int!(i32, NonZeroI32);
impl_From_non_zero_to_int!(u64, NonZeroU64);
impl_From_non_zero_to_int!(i64, NonZeroI64);
impl_From_non_zero_to_int!(u128, NonZeroU128);
impl_From_non_zero_to_int!(i128, NonZeroI128);

macro_rules! impl_TryFrom_int_to_non_zero {
  ($To:ty, $From:ty) => {
    impl TryFrom<XY<$From>> for XY<$To> {
      type Error = ();
      fn try_from(XY { x, y }: XY<$From>) -> Result<Self, Self::Error> {
        Ok(Self { x: <$To>::new(x).ok_or(())?, y: <$To>::new(y).ok_or(())? })
      }
    }
    impl TryFrom<($From, $From)> for XY<$To> {
      type Error = ();
      fn try_from((x, y): ($From, $From)) -> Result<Self, Self::Error> {
        Ok(Self { x: <$To>::new(x).ok_or(())?, y: <$To>::new(y).ok_or(())? })
      }
    }
  };
}
impl_TryFrom_int_to_non_zero!(NonZeroUsize, usize);
impl_TryFrom_int_to_non_zero!(NonZeroIsize, isize);
impl_TryFrom_int_to_non_zero!(NonZeroU8, u8);
impl_TryFrom_int_to_non_zero!(NonZeroI8, i8);
impl_TryFrom_int_to_non_zero!(NonZeroU16, u16);
impl_TryFrom_int_to_non_zero!(NonZeroI16, i16);
impl_TryFrom_int_to_non_zero!(NonZeroU32, u32);
impl_TryFrom_int_to_non_zero!(NonZeroI32, i32);
impl_TryFrom_int_to_non_zero!(NonZeroU64, u64);
impl_TryFrom_int_to_non_zero!(NonZeroI64, i64);
impl_TryFrom_int_to_non_zero!(NonZeroU128, u128);
impl_TryFrom_int_to_non_zero!(NonZeroI128, i128);

macro_rules! impl_From_non_zero_to_float {
  ($To:ty; $($From:ty),+) => ($(
    impl From<XY<$From>> for XY<$To> {
      fn from(XY { x, y }: XY<$From>) -> Self {
        Self { x: From::from(x.get()), y: From::from(y.get()) }
      }
    }
    impl From<($From, $From)> for XY<$To> {
      fn from((x, y): ($From, $From)) -> Self {
        Self { x: From::from(x.get()), y: From::from(y.get()) }
      }
    }
  )+)
}
impl_From_non_zero_to_float!(f32; NonZeroU8, NonZeroI8, NonZeroU16, NonZeroI16);
impl_From_non_zero_to_float!(
  f64; NonZeroU8,
  NonZeroI8,
  NonZeroU16,
  NonZeroI16,
  NonZeroU32,
  NonZeroI32
);

macro_rules! impl_TryFrom_float_to_non_zero {
  ($From:ty; $($To:ty),+) => ($(
    impl TryFrom<XY<$From>> for XY<$To> {
      type Error = ();
      fn try_from(XY { x, y }: XY<$From>) -> Result<Self, Self::Error> {
        Ok(Self {
          x: <$To>::new(NumCast::from(x).ok_or(())?).ok_or(())?,
          y: <$To>::new(NumCast::from(y).ok_or(())?).ok_or(())?
        })
      }
    }
    impl TryFrom<($From, $From)> for XY<$To> {
      type Error = ();
      fn try_from((x, y): ($From, $From)) -> Result<Self, Self::Error> {
        Ok(Self {
          x: <$To>::new(NumCast::from(x).ok_or(())?).ok_or(())?,
          y: <$To>::new(NumCast::from(y).ok_or(())?).ok_or(())?
        })
      }
    }
  )+)
}
impl_TryFrom_float_to_non_zero!(
  f32; NonZeroUsize,
  NonZeroIsize,
  NonZeroU8,
  NonZeroI8,
  NonZeroU16,
  NonZeroI16,
  NonZeroU32,
  NonZeroI32,
  NonZeroU64,
  NonZeroI64,
  NonZeroU128,
  NonZeroI128
);
impl_TryFrom_float_to_non_zero!(
  f64; NonZeroUsize,
  NonZeroIsize,
  NonZeroU8,
  NonZeroI8,
  NonZeroU16,
  NonZeroI16,
  NonZeroU32,
  NonZeroI32,
  NonZeroU64,
  NonZeroI64,
  NonZeroU128,
  NonZeroI128
);

macro_rules! impl_From_tuple {
  ($($T:ty),+) => ($(
    impl From<($T, $T)> for XY<$T> {
      fn from((x, y): ($T, $T)) -> Self {
        Self { x, y }
      }
    }
    impl From<XY<$T>> for ($T, $T) {
      fn from(XY { x, y }: XY<$T>) -> Self {
        (x, y)
      }
    }
  )+)
}
impl_From_tuple!(
  usize, isize, u8, i8, u16, i16, u32, i32, f32, u64, i64, f64, u128, i128
);

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn cast_from() {
    assert_eq!(XY::cast_from(-1.2, -3.4).unwrap(), XY16 { x: -1, y: -3 });
  }

  #[test]
  fn cast_into() {
    assert_eq!(XY::new(-1.2, -3.4).cast_into().unwrap(), XY16 { x: -1, y: -3 });
  }

  #[test]
  fn square() {
    assert_eq!(XY::square(1), XY16 { x: 1, y: 1 });
  }

  #[test]
  fn add() {
    assert_eq!(XY::new(1, 2) + XY::new(3, 4), XY::new(4, 6));
  }

  #[test]
  fn add_assign() {
    let mut xy = XY::new(1, 2);
    xy += XY::new(3, 4);
    assert_eq!(xy, XY::new(4, 6));
  }

  #[test]
  fn sub() {
    assert_eq!(XY::new(1, 2) - XY::new(3, 4), XY::new(-2, -2));
  }

  #[test]
  fn sub_assign() {
    let mut xy = XY::new(1, 2);
    xy -= XY::new(3, 4);
    assert_eq!(xy, XY::new(-2, -2));
  }

  #[test]
  fn mul() {
    assert_eq!(XY::new(1, 2) * XY::new(3, 4), XY::new(3, 8));
    assert_eq!(XY::new(1, 2) * 3, XY::new(3, 6));
  }

  #[test]
  fn mul_assign() {
    let mut xy = XY::new(1, 2);
    xy *= XY::new(3, 4);
    assert_eq!(xy, XY::new(3, 8));
    xy *= 5;
    assert_eq!(xy, XY::new(15, 40));
  }

  #[test]
  fn div() {
    assert_eq!(XY::new(3, 4) / XY::new(1, 2), XY::new(3, 2));
    assert_eq!(XY::new(3, 4) / 2, XY::new(1, 2));
  }

  #[test]
  fn div_assign() {
    let mut xy = XY::new(64, 256);
    xy /= XY::new(2, 4);
    assert_eq!(xy, XY::new(32, 64));
    xy /= 2;
    assert_eq!(xy, XY::new(16, 32));
  }

  #[test]
  fn area() {
    assert_eq!(XY::new(10, 200).area(), 2000);
  }

  #[test]
  fn min() {
    [
      ((1, 20), (300, 4000), (1, 20)),
      ((100, 20), (3, 4000), (3, 20)),
      ((1, 2000), (300, 40), (1, 40)),
      ((100, 2000), (3, 40), (3, 40)),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, &(lhs, rhs, expected))| {
      assert_eq!(
        XY32::from(lhs).min(&rhs.into()),
        expected.into(),
        "Case {} failed: {:?}.",
        i,
        (lhs, rhs, expected)
      );
    });
  }

  #[test]
  fn max() {
    [
      ((1, 20), (300, 4000), (300, 4000)),
      ((100, 20), (3, 4000), (100, 4000)),
      ((1, 2000), (300, 40), (300, 2000)),
      ((100, 2000), (3, 40), (100, 2000)),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, &(lhs, rhs, expected))| {
      assert_eq!(
        XY32::from(lhs).max(&rhs.into()),
        expected.into(),
        "Case {} failed: {:?}.",
        i,
        (lhs, rhs, expected)
      );
    });
  }

  #[test]
  fn clamp() {
    [
      ((10, 200), (11, 201), (1000, 1000), (11, 201)),
      ((10, 200), (0, 0), (1000, 1000), (10, 200)),
      ((10, 200), (0, 0), (9, 199), (9, 199)),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, &(val, min, max, expected))| {
      assert_eq!(
        XY32::from(val).clamp(&min.into(), &max.into()),
        expected.into(),
        "Case {} failed: {:?}.",
        i,
        (val, min, max, expected)
      );
    });
  }

  #[test]
  fn abs_neg() {
    assert_eq!(XY::new(-1, -2).abs(), XY::new(1, 2));
  }

  #[test]
  fn abs_mix() {
    assert_eq!(XY::new(-1, 2).abs(), XY::new(1, 2));
  }

  #[test]
  fn abs_pos() {
    assert_eq!(XY::new(1, 2).abs(), XY::new(1, 2));
  }

  #[test]
  fn magnitude_int() {
    assert_eq!(XY16 { x: 3, y: 4 }.magnitude(), 5);
  }

  #[test]
  fn magnitude_int_trunc() {
    assert_eq!(XY16 { x: 2, y: 2 }.magnitude(), 2);
  }

  #[test]
  fn magnitude_float() {
    assert_eq!(XY::new(3f32, 4.).magnitude(), 5.);
  }

  #[test]
  fn lerp() {
    assert_eq!(XY::new(1., 2.).lerp(&XY::new(3., 4.), 0.5), XY::new(2., 3.));
  }

  #[test]
  fn try_lerp() {
    assert_eq!(
      XY16 { x: 1, y: 2 }.try_lerp(&XY::new(3, 4), 0.5).unwrap(),
      XY::new(2, 3)
    );
  }

  #[test]
  fn from_to_float() {
    assert_eq!(XY::from(XY::new(1, 2)), XY::new(1., 2.));
    assert_eq!(XY::from((1, 2)), XY::new(1., 2.));
  }

  #[test]
  fn try_from_float() {
    assert_eq!(XY::try_from(XY::new(1., 2.)).unwrap(), XY::new(1, 2));
    assert_eq!(XY::try_from((1., 2.)).unwrap(), XY::new(1, 2));
  }

  #[test]
  fn from_widen() {
    assert_eq!(XY::from(XY::new(1u8, 2)), XY::new(1u16, 2));
    assert_eq!(XY::from((1u8, 2)), XY::new(1u16, 2));
  }

  #[test]
  fn try_from_int() {
    assert_eq!(XY::try_from(XY::new(1i64, 2)).unwrap(), XY::new(1i32, 2));
    assert_eq!(XY::try_from((1i64, 2)).unwrap(), XY::new(1i32, 2));
  }

  #[test]
  fn from_non_zero_to_int() {
    assert_eq!(
      XY::from(XY::new(NonZeroI8::new(1).unwrap(), NonZeroI8::new(2).unwrap())),
      XY::new(1, 2)
    );
    assert_eq!(
      XY::from((NonZeroI8::new(1).unwrap(), NonZeroI8::new(2).unwrap())),
      XY::new(1, 2)
    );
  }

  #[test]
  fn try_from_int_to_non_zero() {
    let xy = XY::new(NonZeroI8::new(1).unwrap(), NonZeroI8::new(2).unwrap());
    assert_eq!(XY::try_from(XY::new(1, 2)).unwrap(), xy);
    assert_eq!(XY::try_from((1, 2)).unwrap(), xy);
  }

  #[test]
  fn from_non_zero_to_float() {
    assert_eq!(
      XY::from(XY::new(NonZeroI8::new(1).unwrap(), NonZeroI8::new(2).unwrap())),
      XY::new(1., 2.),
    );
    assert_eq!(
      XY::from((NonZeroI8::new(1).unwrap(), NonZeroI8::new(2).unwrap())),
      XY::new(1., 2.),
    );
  }

  #[test]
  fn try_from_float_to_non_zero() {
    let xy = XY::<NonZeroI8>::try_from((1, 2)).unwrap();
    assert_eq!(XY::try_from(XY::new(1., 2.)).unwrap(), xy);
    assert_eq!(XY::try_from((1., 2.)).unwrap(), xy);
  }

  #[test]
  fn from_tuple() {
    assert_eq!(XY::from((1, 2)), XY::new(1, 2));
    assert_eq!(<(i32, i32)>::from(XY::new(1, 2)), (1, 2));
  }
}
