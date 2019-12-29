use futures::prelude::*;
use wasm_bindgen::JsValue;
use wasm_bindgen_futures::JsFuture;
use wasm_bindgen_test::wasm_bindgen_test;

// This runs a unit test in native Rust, so it can only use Rust APIs.
#[test]
fn rust_test() {
  assert_eq!(1, 1);
}

// This runs a unit test in the browser, so it can use browser APIs.
#[wasm_bindgen_test]
fn web_test() {
  assert_eq!(1, 1);
}

// This runs a unit test in the browser, and in addition it supports asynchronous Future APIs.
#[wasm_bindgen_test(async)]
fn async_test() -> impl Future<Output = ()> {
  let promise = js_sys::Promise::resolve(&JsValue::from(42));

  JsFuture::from(promise).map(|x| {
    assert_eq!(x.unwrap(), 42);
  })
}
