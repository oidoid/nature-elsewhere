use num::traits::{cast::FromPrimitive, real::Real};

/// If self == to, returns self. Otherwise, returns lerp != self.
pub fn lerp<T: Real>(from: T, to: T, ratio: T) -> T {
  from + (to - from) * ratio
}

pub trait Lerp<T> {
  fn lerp(self, to: Self, ratio: T) -> Self;
}

macro_rules! impl_Lerp_float {
  ($($t:ty)*) => ($(
    impl Lerp<$t> for $t {
      fn lerp(self, to: Self, ratio: Self) -> Self {
        lerp(self, to, ratio)
      }
    }
  )*)
}
impl_Lerp_float!(f32 f64);

macro_rules! impl_Lerp_f32 {
  ($($t:ty)*) => ($(
    impl Lerp<f32> for $t {
      fn lerp(self, to: Self, ratio: f32) -> Self {
        let interpolation = Self::from_f32(lerp(self.into(), to.into(), ratio)).expect(&format!("Lerp conversion from f32 to {} failed.", stringify!($t)));
        if self == to || self != interpolation || ratio == 0. {
          return interpolation;
        }
        // Guarantee that integer T accumulations always progress.
        let delta: f32 = (to - interpolation).into();
        interpolation + Self::from_f32(delta.signum()).expect(&format!("Lerp delta conversion from f32 to {} failed.", stringify!($t)))
      }
    }
  )*)
}
impl_Lerp_f32!(u8 i8 u16 i16);

macro_rules! impl_Lerp_f64 {
  ($($t:ty)*) => ($(
    impl Lerp<f64> for $t {
      fn lerp(self, to: Self, ratio: f64) -> Self {
        let interpolation = Self::from_f64(lerp(self.into(), to.into(), ratio)).expect(&format!("Lerp conversion from f64 to {} failed.", stringify!($t)));
        if self == to || self != interpolation || ratio == 0. {
          return interpolation;
        }
        // Guarantee that integer T accumulations always progress.
        let delta: f64 = (to - interpolation).into();
        interpolation + Self::from_f64(delta.signum()).expect(&format!("Lerp delta conversion from f64 to {} failed.", stringify!($t)))
      }
    }
  )*)
}
impl_Lerp_f64!(u32 i32);

#[cfg(test)]
mod test {
  use super::*;

  #[test]
  fn lerp_float() {
    [
      // Negative to.
      (-5., -10., 0.1, -5.5),
      (-1., -10., 0.1, -1.9),
      (1., -10., 0.1, -0.1),
      (5., -10., 0.1, 3.5),
      (10., -10., 0.1, 8.),
      (11., -10., 0.1, 8.9),
      (15., -10., 0.1, 12.5),
      (-5., -10., 1., -10.),
      (-1., -10., 1., -10.),
      (1., -10., 1., -10.),
      (5., -10., 1., -10.),
      (10., -10., 1., -10.),
      (11., -10., 1., -10.),
      (15., -10., 1., -10.),
      (-5., -10., 0., -5.),
      (-1., -10., 0., -1.),
      (1., -10., 0., 1.),
      (5., -10., 0., 5.),
      (10., -10., 0., 10.),
      (11., -10., 0., 11.),
      (15., -10., 0., 15.),
      // // Zero to.
      (-5., 0., 0.1, -4.5),
      (-1., 0., 0.1, -0.9),
      (0., 0., 0.1, 0.),
      (1., 0., 0.1, 0.9),
      (5., 0., 0.1, 4.5),
      (-5., 0., 1., 0.),
      (-1., 0., 1., 0.),
      (0., 0., 1., 0.),
      (1., 0., 1., 0.),
      (5., 0., 1., 0.),
      (-5., 0., 0., -5.),
      (-1., 0., 0., -1.),
      (0., 0., 0., 0.),
      (1., 0., 0., 1.),
      (5., 0., 0., 5.),
      // Positive to.
      (-5., 10., 0.1, -3.5),
      (-1., 10., 0.1, 0.1),
      (1., 10., 0.1, 1.9),
      (5., 10., 0.1, 5.5),
      (10., 10., 0.1, 10.),
      (11., 10., 0.1, 10.9),
      (15., 10., 0.1, 14.5),
      (-5., 10., 1., 10.),
      (-1., 10., 1., 10.),
      (1., 10., 1., 10.),
      (5., 10., 1., 10.),
      (10., 10., 1., 10.),
      (11., 10., 1., 10.),
      (15., 10., 1., 10.),
      (-5., 10., 0., -5.),
      (-1., 10., 0., -1.),
      (1., 10., 0., 1.),
      (5., 10., 0., 5.),
      (10., 10., 0., 10.),
      (11., 10., 0., 11.),
      (15., 10., 0., 15.),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, &(val, to, ratio, expected))| {
      assert_approx!(
        lerp(val, to, ratio),
        expected,
        "Function case {} failed: {:?}.",
        i,
        (val, to, ratio, expected)
      );
      assert_approx!(
        val.lerp(to, ratio),
        expected,
        "Method case {} failed: {:?}.",
        i,
        (val, to, ratio, expected)
      );
    });
  }

  #[test]
  fn lerp_int() {
    [
      // Negative to.
      (-5, -10, 0.1, -6),
      (-1, -10, 0.1, -2),
      (1, -10, 0.1, 0),
      (5, -10, 0.1, 3),
      (10, -10, 0.1, 8),
      (11, -10, 0.1, 8),
      (15, -10, 0.1, 12),
      (-5, -10, 1., -10),
      (-1, -10, 1., -10),
      (1, -10, 1., -10),
      (5, -10, 1., -10),
      (10, -10, 1., -10),
      (11, -10, 1., -10),
      (15, -10, 1., -10),
      (-5, -10, 0., -5),
      (-1, -10, 0., -1),
      (1, -10, 0., 1),
      (5, -10, 0., 5),
      (10, -10, 0., 10),
      (11, -10, 0., 11),
      (15, -10, 0., 15),
      // Zero to.
      (-5, 0, 0.1, -4),
      (-1, 0, 0.1, 0),
      (0, 0, 0.1, 0),
      (1, 0, 0.1, 0),
      (5, 0, 0.1, 4),
      (-5, 0, 1., 0),
      (-1, 0, 1., 0),
      (0, 0, 1., 0),
      (1, 0, 1., 0),
      (5, 0, 1., 0),
      (-5, 0, 0., -5),
      (-1, 0, 0., -1),
      (0, 0, 0., 0),
      (1, 0, 0., 1),
      (5, 0, 0., 5),
      // Positive to.
      (-5, 10, 0.1, -3),
      (-1, 10, 0.1, 0),
      (1, 10, 0.1, 2),
      (5, 10, 0.1, 6),
      (10, 10, 0.1, 10),
      (11, 10, 0.1, 10),
      (15, 10, 0.1, 14),
      (-5, 10, 1., 10),
      (-1, 10, 1., 10),
      (1, 10, 1., 10),
      (5, 10, 1., 10),
      (10, 10, 1., 10),
      (11, 10, 1., 10),
      (15, 10, 1., 10),
      (-5, 10, 0., -5),
      (-1, 10, 0., -1),
      (1, 10, 0., 1),
      (5, 10, 0., 5),
      (10, 10, 0., 10),
      (11, 10, 0., 11),
      (15, 10, 0., 15),
    ]
    .iter()
    .enumerate()
    .for_each(|(i, &(val, to, ratio, expected))| {
      assert_eq!(
        val.lerp(to, ratio),
        expected,
        "Case {} failed: {:?}.",
        i,
        (val, to, ratio, expected)
      );
    });
  }
}
