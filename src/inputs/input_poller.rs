use super::{input::Input, input_set::InputSet};
use crate::math::xy::XY;
use crate::wasm::event_listener::{AddEventListener, EventListener};
use std::cell::RefCell;
use std::rc::Rc;
use wasm_bindgen::JsCast;
use web_sys::{PointerEvent, Window};

#[derive(Clone)]
pub struct InputPoller {
  win: Window,
  listeners: Rc<RefCell<Vec<EventListener>>>,
  inputs: Rc<RefCell<InputSet>>,
}

impl InputPoller {
  pub fn new(win: &Window) -> Self {
    Self {
      win: win.clone(),
      listeners: Rc::new(RefCell::new(vec![])),
      inputs: Rc::new(RefCell::new(InputSet::new())),
    }
  }

  pub fn register(&self) {
    if !self.listeners.borrow().is_empty() {
      return;
    }

    let rc = Rc::new(RefCell::new(self.clone()));
    Self::add_on_event_listener(&rc, "pointerup");
    Self::add_on_event_listener(&rc, "pointermove");
    Self::add_on_event_listener(&rc, "pointerdown");
    Self::add_on_event_listener(&rc, "pointercancel");
  }

  pub fn deregister(&self) {
    // EventListener.drop() will invoke EventTarget.remove_event_listener().
    self.listeners.borrow_mut().clear();
  }

  fn on_event(&mut self, event: &PointerEvent) {
    web_sys::console::log_1(&event.type_().into());
    self.inputs.borrow_mut().point = self.event_to_point(event);
    self.inputs.borrow_mut().pick = self.event_to_pick(event);
    event.prevent_default();
  }

  fn event_to_point(&self, event: &PointerEvent) -> Option<Input> {
    let kind = event.type_();
    if kind == "pointercancel" {
      return None;
    }
    let active = kind == "pointermove" || kind == "pointerdown";
    let mut timer = 1.;
    if let Some(point) = &self.inputs.borrow().point {
      timer = if point.active != active { 0. } else { point.timer }
    };
    Some(Input {
      active,
      timer,
      window_position: XY { x: event.client_x(), y: event.client_y() },
    })
  }

  fn event_to_pick(&self, event: &PointerEvent) -> Option<Input> {
    let kind = event.type_();
    if kind == "pointercancel" {
      return None;
    }
    let mut active = kind == "pointerdown";
    let mut timer = 1.;
    if let Some(pick) = &self.inputs.borrow().pick {
      active = active || kind == "pointermove" && pick.active;
      timer = if pick.active == active { pick.timer } else { 0. };
    }
    Some(Input {
      active,
      timer,
      window_position: XY { x: event.client_x(), y: event.client_y() },
    })
  }

  fn add_on_event_listener(rc: &Rc<RefCell<Self>>, event: &'static str) {
    let rc1 = rc.clone();
    rc.borrow().listeners.borrow_mut().push(
      rc.borrow().win.add_event_listener(event, move |ev| {
        rc1.borrow_mut().on_event(&ev.dyn_into().unwrap())
      }),
    );
  }
}
