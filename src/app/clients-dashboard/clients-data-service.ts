import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClientsDataService {
  private clientsJsonFilePath = '/assets/data/clients.json';
  private accountsWithMarketValueJsonFilePath = '/assets/data/accounts.json';
  constructor(private http: HttpClient) { }
  getProductsData() {
    return this.http.get<any>(this.clientsJsonFilePath);
  }

  getProducts() {
    return this.http.get<any>(this.clientsJsonFilePath);
  }
  getAccountsWithMarketValue(accountNumbers: string[]) {
    console.log('Fetching market values for accounts:', accountNumbers);
    return this.http.get<any>(this.accountsWithMarketValueJsonFilePath);
  }


}
