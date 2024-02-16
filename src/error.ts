export class UnfinishedOverrideError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, UnfinishedOverrideError.prototype);
  }
}

export class InvalidReplacementError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, InvalidReplacementError.prototype);
  }
}