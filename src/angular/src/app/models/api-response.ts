// This will be removed when error handling is refactored
export class ApiResponse<T = null> {
  ok: boolean;
  status: number;
  data: T | null;

  constructor(ok: boolean, status: number, data: T | null) {
    this.ok = ok;
    this.status = status;
    this.data = data;
  }
}
