export class UnfinishedOverrideError extends Error {
  constructor(message?: string) {
      super(message);
      Object.setPrototypeOf(this, UnfinishedOverrideError.prototype);
  }
}