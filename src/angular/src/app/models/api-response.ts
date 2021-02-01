export class ApiResponse<T = null> {
  status: number;
  data: T | null;

  constructor(status: number, data: T | null) {
    this.status = status;
    this.data = data;
  }
}
