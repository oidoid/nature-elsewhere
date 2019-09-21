export enum UpdateStatus {
  /** No change in state. Up./UpdateStatusinuation allowed. */
  UNCHANGED = 0b00,
  /** Updated state. Update chain continuation allowed. */
  UPDATED = 0b01,
  /** Update chain continuation forbidden. */
  TERMINATE = 0b10
}

export namespace UpdateStatus {
  export function terminate(status: UpdateStatus | number): boolean {
    return (status & UpdateStatus.TERMINATE) === UpdateStatus.TERMINATE
  }
}
