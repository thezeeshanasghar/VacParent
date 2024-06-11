import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError,map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseService {

  private authenticationState = new BehaviorSubject(false);
  private readonly API_LOGIN = `${environment.BASE_URL}user/`
   private readonly API_URL = `${environment.BASE_URL}/`
  constructor(
    protected http: HttpClient
  ) { super(http); }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  changeState(val: boolean) {
    this.authenticationState.next(val);
  }

  checkAuth(data): Observable<any> {
    const url = `${this.API_LOGIN}login`;
    return this.http.post(url, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  getDoctorProfile(userId: number): Observable<any> {
    const url = `${environment.BASE_URL}doctor/user/${userId}`;
    return this.http.get(url, this.httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  forgotPassword(number , date): Observable<any> {
    const url = `${this.API_LOGIN}${number}/${date}`;
    return this.http.get(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  forgotPassword2(email:string): Observable<any> {
    const sanitizedEmail = email.replace(/^"|"$/g, '');
  // Encode the email
  const encodedEmail = encodeURIComponent(sanitizedEmail);
  const url = `${this.API_LOGIN}forget/${encodedEmail}`;
    return this.http.get(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  ChangePassword(data): Observable<any> {
    const url = `${this.API_LOGIN}change-password`;
    return this.http.post(url, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

}
