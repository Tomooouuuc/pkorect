export class BusinessException extends Error {
  constructor(
    public code: number,
    message?: string
  ) {
    super(message);
  }
}
