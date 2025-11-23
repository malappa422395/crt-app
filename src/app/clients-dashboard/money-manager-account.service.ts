import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MoneyManagerAccountService {

  CLIENT_BASE_URL = '';
  PROSPECT_BASE_URL = '';
  CRM_BASE_URL = '';

  constructor(private http: HttpClient) { }

  isDuplicateCase(cert_title: string) {
    const title = cert_title.replace(/'/g, "%27")
    const queryParams = new HttpParams()
      .append('$select', 'cert_title')
      .append('$filter', `(cert_title eq \'${title}\')`)
      .append('$top', '1')
    return this.http.get(`${this.CRM_BASE_URL}/api/data/v9.1/cert_cases`, { params: queryParams }).pipe(
      //retry(2),
      catchError(this.handleError)
    )
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

}




