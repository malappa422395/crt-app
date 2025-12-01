import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientsPayload } from '../types';
import { catchError, retry, throwError } from 'rxjs';
import { FaUserStore } from '../faStore';

@Injectable({
  providedIn: 'root'
})
export class ClientsDataService {
  private clientsJsonFilePath = 'https://raw.githubusercontent.com/malappa422395/crt-app/refs/heads/master/src/assets/data/clients.json';
  private accountsWithMarketValueJsonFilePath = 'https://raw.githubusercontent.com/malappa422395/crt-app/refs/heads/master/src/assets/data/accounts.json';
  constructor(private http: HttpClient, private faUserStore: FaUserStore) { }
  getClients(clientsPayload: ClientsPayload) {
   return this.http.post(this.faUserStore.faUser()?.clientBaseUrl, clientsPayload, { withCredentials: true }).pipe(
  // return this.http.get<any>(this.clientsJsonFilePath).pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  getAccountsWithMarketValue(accountNumbers: string[]) {
    console.log('Fetching market values for accounts:', accountNumbers);
    return this.http.post(this.faUserStore.faUser()?.accountBaseUrl,  { accountNumbers }, { withCredentials: true }).pipe(
    // return this.http.get<any>(this.accountsWithMarketValueJsonFilePath).pipe(
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
