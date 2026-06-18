import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

// Read-only client for the VaccineInfo (vaccine education content) API.
// VacParent is a read-only consumer: no add/edit/delete methods here by design.
@Injectable({
  providedIn: 'root'
})
export class VaccineInfoService extends BaseService {

  private readonly API_VACCINEINFO = `${environment.BASE_URL}vaccineinfo`;

  constructor(
    protected http: HttpClient
  ) { super(http); }

  getVaccineInfos(): Observable<any> {
    return this.http.get(this.API_VACCINEINFO, this.httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
  }

}
