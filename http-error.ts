export default class HttpError extends Error {
  
  public get status() : number {
    return this._status;
  }
  

  constructor(private _status: number, message: string) {
    super(message);
  }
}