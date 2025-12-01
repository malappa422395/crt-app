import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ClientsDataService } from './clients-data-service';
import { map, Observable } from 'rxjs';
import { AccountsLayoutComponent } from "./accounts-layout-component/accounts-layout-component";
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { getIframeQueryParams } from '../utils';
import { faParameters, FaUserStore } from '../faStore';
import { getClientsPayload } from '../clientsApiPayload';
import { ClientsPayload } from '../types';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProspectDashboard } from "../prospect-dashboard/prospect-dashboard";

@Component({
  selector: 'app-clients-dashboard',
  imports: [CommonModule, FormsModule, TableModule, AccountsLayoutComponent, RadioButtonModule, InputTextModule, ButtonModule, ProspectDashboard],
  templateUrl: './clients-dashboard.html',
  styleUrl: './clients-dashboard.scss',
})

export class ClientsDashboard {
  products: Array<any> = [];
  products$!: Observable<any[]>;
  selectedProducts!: any;
  categoryType!: { name: string; key: string };
  urlParams: any;
  categoryTypes: any[] = [
    { name: 'Clients', key: 'C' },
    { name: 'Prospects', key: 'P' },
  ];
  searchText: string = '';
  constructor(private clientsDataService: ClientsDataService, private faUserStore: FaUserStore) { }
  ngOnInit() {
    this.searchText = '';
    this.categoryType = this.categoryTypes[0];
    this.urlParams = getIframeQueryParams();

    if (this.urlParams && this.urlParams?.get("data")) {
      const urlData = JSON.parse(this.urlParams.get("data") ?? '{}');
      const faUserParameters: faParameters = {
        cId: urlData?.cId?.substring(1, 37),
        cssId: urlData?.cssId,
        pId: urlData?.pId,
        ntlogin: urlData?.ntlogin,
        clientBaseUrl: urlData?.clientBaseUrl,
        prospectBaseUrl: urlData?.prospectBaseUrl,
        globalContextUrl: urlData?.globalContextUrl,
        accountBaseUrl: urlData?.accountBaseUrl
      }
      if (faUserParameters) {
        this.faUserStore.setUser(faUserParameters);
      }
      const clientsPayload: ClientsPayload = getClientsPayload({ ntlogin: faUserParameters.ntlogin ?? '', searchText: "o"});
      this.getClients(clientsPayload);
    }
  }
  reloadDataDefault() {
    const faUserParameters = this.faUserStore.faUser();
    const clientsPayload: ClientsPayload = getClientsPayload({ ntlogin: faUserParameters.ntlogin ?? '', searchText: "o" });
    this.getClients(clientsPayload);
    this.searchText = '';
  }
  getPayloadCrieria(userInput?: string) {
    const faUserParameters = this.faUserStore.faUser();
    const clientsPayload: ClientsPayload = getClientsPayload({ ntlogin: faUserParameters.ntlogin ?? '', searchText: userInput });
    this.getClients(clientsPayload);
    this.searchText = '';
  }

  getClients(clientsPayload: ClientsPayload) {
    this.products$ = this.clientsDataService.getClients(clientsPayload).pipe(
      map((data: any) => (data.response.docs as any[]).map((item: any) => {
        return { ...item };
      }))
    );
  }
  applySearch() {
    const input = this.searchText.trim().toLowerCase();
    if (!input) {
      alert('Please enter a valid search input.');
      return;
    }
    // Account number pattern: 3 digits + 2 alphanumeric + 3 digits
    const accountPattern = /^\d{3}[A-Za-z0-9]{2}\d{3}$/;
    if (accountPattern.test(input)) {
      console.log('Account number search:', input);
      this.getPayloadCrieria(input)
      return;
    }
    const nameParts = input.split(',').map(p => p.trim());
    if (nameParts.length === 1) {
      console.log('Partial last name search:', nameParts[0]);
      this.getPayloadCrieria(nameParts[0])
      return;
    } else if (nameParts.length === 2) {
      console.log('Full name search - Last Name:', nameParts[0], 'First Name:', nameParts[1]);
      this.getPayloadCrieria(nameParts[0] + ', ' + nameParts[1])
      return
    }
  }
}