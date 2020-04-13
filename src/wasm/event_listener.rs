use wasm_bindgen::{closure::Closure, JsCast};
use web_sys::{Element, Event, EventTarget, Window};

pub struct EventListener {
  target: EventTarget,
  event: &'static str,
  closure: Closure<dyn FnMut(Event)>,
}

impl EventListener {
  pub fn new<T>(target: EventTarget, event: &'static str, listener: T) -> Self
  where
    T: FnMut(Event) + 'static,
  {
    let listener: Box<dyn FnMut(_)> = Box::new(listener);
    let closure = Closure::wrap(listener);
    target
      .add_event_listener_with_callback(event, closure.as_ref().unchecked_ref())
      .expect(&format!("{} EventListener not added.", event));
    Self { target, event, closure }
  }
}

impl Drop for EventListener {
  fn drop(&mut self) {
    self
      .target
      .remove_event_listener_with_callback(
        self.event,
        self.closure.as_ref().unchecked_ref(),
      )
      .expect(&format!("{} EventListener not removed.", self.event))
  }
}

pub trait AddEventListener<T> {
  fn add_event_listener(
    &self,
    event: &'static str,
    listener: T,
  ) -> EventListener;
}

macro_rules! impl_AddEventListener {
  ($($t:ty),*) => ($(
    impl<T> AddEventListener<T> for $t
    where
      T: 'static + FnMut(Event),
    {
      fn add_event_listener(
        &self,
        event: &'static str,
        listener: T,
      ) -> EventListener {
        EventListener::new(self.clone().into(), event, listener)
      }
    }
  )*)
}
impl_AddEventListener!(Window, Element);
