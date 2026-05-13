import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable({ providedIn: 'root' })
export class BookingService extends BaseService {
  private readonly API = `${environment.BASE_URL}`;

  constructor(protected http: HttpClient) { super(http); }

  getLastBooking(childId: number): Observable<any> {
    return this.http.get(`${this.API}booking/last/${childId}`, this.httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  addBooking(data: any): Observable<any> {
    return this.http.post(`${this.API}booking`, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  getParentNotifications(userId: number): Observable<any> {
    return this.http.get(`${this.API}notification/parent/${userId}`, this.httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  getByParent(userId: number): Observable<any> {
    return this.http.get(`${this.API}booking/parent/${userId}`, this.httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  markRead(notifId: number): Observable<any> {
    return this.http.put(`${this.API}notification/${notifId}/read`, {}, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}
