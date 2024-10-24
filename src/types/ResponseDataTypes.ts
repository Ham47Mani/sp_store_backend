// === Response Data Interface
export interface ResponseData<T> {
  message: string;
  success: boolean;
  result: any,
  error: null;
  timeStamp: Date;
  statusCode: number;
  path? : string;
}