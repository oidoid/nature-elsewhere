export interface PollEvent {
  event?: Event
  readonly onEvent: EventListener
}

export namespace PollEvent {
  export type Filter = (event: Event) => boolean

  export function make(filter: Filter): PollEvent {
    const poll: PollEvent = {
      onEvent(event) {
        if (filter(event)) onEvent(poll, event)
      }
    }
    return poll
  }

  export function register(
    poll: PollEvent,
    target: EventTarget,
    type: string,
    options?: boolean | AddEventListenerOptions
  ): void {
    target.addEventListener(type, poll.onEvent, options)
  }

  export function deregister(
    poll: PollEvent,
    target: EventTarget,
    type: string,
    options?: boolean | EventListenerOptions
  ): void {
    target.removeEventListener(type, poll.onEvent, options)
  }
}

function onEvent(poll: PollEvent, event: Event): void {
  poll.event = event
  event.preventDefault()
}
