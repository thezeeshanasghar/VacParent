import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError} from 'rxjs'
import { TimeoutError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  protected httpOptions = {
    headers : new HttpHeaders({'Content-Type':'application/json'})
  };
  constructor(
    protected http: HttpClient
  ) { }

  protected handleError(error: HttpErrorResponse | TimeoutError) {
    if (error instanceof TimeoutError) {
      console.error('Request timed out');
      return throwError('The request timed out. Please check your connection and try again.');
    }
    if(error.error instanceof ErrorEvent) {
      console.error('An error occured', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    const msg = error.error && error.error.message
      ? error.error.message
      : (error.message || 'Something went wrong. Please try again.');
    return throwError(msg);
  }

  protected extractData(res: Response) {
    let body = res;
    return body || {};
  }
}
