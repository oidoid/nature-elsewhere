export type PollEventFilter = (event: Event) => boolean

export class PollEvent {
  private event?: Event
  private readonly filter: PollEventFilter

  constructor(filter: PollEventFilter) {
    this.filter = filter
    this.onEvent = this.onEvent.bind(this)
  }

  poll(): Maybe<Event> {
    return this.event
  }

  register(
    target: EventTarget,
    type: string,
    options?: boolean | AddEventListenerOptions
  ): void {
    target.addEventListener(type, this.onEvent, options)
  }

  deregister(
    target: EventTarget,
    type: string,
    options?: boolean | EventListenerOptions
  ): void {
    target.removeEventListener(type, this.onEvent, options)
  }

  private onEvent(event: Event): void {
    if (!this.filter(event)) return
    this.event = event
    event.preventDefault()
  }
}

// +encapsulates data well
// +slightly fewer lines
// no argument bundle
// -implicit this binding
// +looks a little more conventional, especially the constructor
