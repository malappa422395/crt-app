import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FaUserStore } from '../faStore';
import { ClientsPayload } from '../types';
import { catchError, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProspectDataService {
  private prospectsJsonFilePath = 'https://raw.githubusercontent.com/malappa422395/crt-app/refs/heads/master/src/assets/data/prospect.json';

  constructor(private http: HttpClient, private faUserStore: FaUserStore) { }

  getProspects(clientsPayload: ClientsPayload) {
    return this.http.post(this.faUserStore.faUser()?.prospectBaseUrl, clientsPayload, { withCredentials: true }).pipe(
    // return this.http.get<any>(this.prospectsJsonFilePath).pipe(
      retry(2),
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
