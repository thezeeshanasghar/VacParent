import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ScheduleService extends BaseService {
  private readonly API = `${environment.BASE_URL}`;

  constructor(protected http: HttpClient) {
    super(http);
  }

  getSchedule(Id: String): Observable<any> {
    const url = `${this.API}doctorschedule/${Id}`;
    return this.http.get(url, this.httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }
  getChilds(Id: String): Observable<any> {
    const url = `${this.API}child/user/${Id}`;
    return this.http.get(url, this.httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }
  getVaccinationById(id: string): Observable<any> {
    const url = `${this.API}child/${id}/schedule`;
    return this.http.get(url, this.httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  getAllDoctors(): Observable<any> {
    const url = `${this.API}doctor`;
    return this.http.get(url, this.httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

  updateChildClinicId(doctorId: number, childId: number): Observable<any> {
    const url = `${this.API}Doctor/update-clinic-id?doctorId=${doctorId}&childId=${childId}`;
    return this.http.patch<any>(url, {}, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  updateVaccinationDate(data , max , min , gap): Observable<any> {
    //const url = `${this.API_VACCINE}schedule/Reschedule?ignoreMaxAgeRule=${max}false&ignoreMinAgeFromDOB=false&ignoreMinGapFromPreviousDose=false`;
    const url = `${this.API}schedule/Reschedule?ignoreMaxAgeRule=${max}&ignoreMinAgeFromDOB=${min}&ignoreMinGapFromPreviousDose=${gap}`;
    return this.http.put(url, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  addBooking(data): Observable<any> {
    //const url = `${this.API_VACCINE}schedule/Reschedule?ignoreMaxAgeRule=${max}false&ignoreMinAgeFromDOB=false&ignoreMinGapFromPreviousDose=false`;
    const url = `${this.API}booking`;
    return this.http.post(url, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

 
}
