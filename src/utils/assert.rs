#[cfg(test)]
macro_rules! assert_approx {
  ($lhs:expr, $rhs:expr, $($arg:tt)+) => {
    assert!((($lhs - $rhs) as f64).abs() < 1e-6, r#"assertion failed: `(left == right)`
    left: `{:?}`,
   right: `{:?}`: {}"#, $lhs, $rhs, format_args!($($arg)+));
  };
}
