use serde::Deserialize;
use wasm_bindgen::prelude::JsValue;
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use web_sys::{Request, Response, Window};

pub async fn json<T: for<'a> Deserialize<'a>>(
  window: &Window,
  path: &str,
) -> Result<T, JsValue> {
  let request = Request::new_with_str(path)?;
  request.headers().set("Accept", "application/json")?;
  let response: Response =
    JsFuture::from(window.fetch_with_request(&request)).await?.dyn_into()?;
  JsFuture::from(response.json()?)
    .await?
    .into_serde()
    .map_err(|error| error.to_string().into())
}

pub async fn text(
  window: &Window,
  path: &str,
  mime_type: &str,
) -> Result<String, JsValue> {
  let request = Request::new_with_str(path)?;
  request.headers().set("Accept", mime_type)?;
  let response: Response =
    JsFuture::from(window.fetch_with_request(&request)).await?.dyn_into()?;
  JsFuture::from(response.text()?)
    .await?
    .as_string()
    .ok_or(JsValue::from("Fetch response text to string conversion failed."))
}
