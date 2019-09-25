export enum UpdateStatus {
  /** No change in state. Up./UpdateStatusinuation allowed. */
  UNCHANGED = 0,
  /** Updated state. Update chain continuation allowed. */
  UPDATED = 1 << 0,
  /** Update chain continuation forbidden. */
  TERMINATE = 1 << 1
}

export namespace UpdateStatus {
  export function terminate(status: UpdateStatus | number): boolean {
    return (status & UpdateStatus.TERMINATE) === UpdateStatus.TERMINATE
  }
}
