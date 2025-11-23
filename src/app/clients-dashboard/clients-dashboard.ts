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

@Component({
  selector: 'app-clients-dashboard',
  imports: [CommonModule, FormsModule, TableModule, AccountsLayoutComponent, RadioButtonModule],
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
  constructor(private clientsDataService: ClientsDataService, private faUserStore: FaUserStore) { }
  ngOnInit() {
    this.categoryType = this.categoryTypes[0];
    this.urlParams = getIframeQueryParams();
    // this.urlParams = {
    //   data: JSON.stringify({
    //     "cId": "{269E5EA0-D7C7-F011-B917-000D3A1C0DFD}",
    //     "cssId": "Riley, Julie",
    //     "pId": "689681",
    //     "ntlogin": "jriley1",
    //     "clientBaseUrl": "https://searchqa.rjf.com",
    //     "prospectBaseUrl": "https://apiqa.rjf.com",
    //     "globalContextUrl": "http://crmdevbox:5555/CERT",
    //     "accountBaseUrl": "https://apiqa.rjf.com"
    //   })
    // }
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
      const clientsPayload: ClientsPayload = getClientsPayload({ ntlogin: faUserParameters.ntlogin ?? '' });
      this.products$ = this.clientsDataService.getClients(clientsPayload).pipe(
        map((data: any) => (data.response.docs as any[]).map((item: any) => {
          return { ...item };
        }))
      );
    }
  }
}