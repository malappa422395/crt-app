import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ClientsDataService } from './clients-data-service';
import { clientsAccounts } from './types/clientsAccounts';
import { map, Observable, from } from 'rxjs';
import { AccountsSoureComponent } from "./accounts-soure-component/accounts-soure-component";
import { AccountsLayoutComponent } from "./accounts-layout-component/accounts-layout-component";
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';

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
  accountsCategory!: { name: string; key: string };

  categories: any[] = [
    { name: 'Clients', key: 'C' },
    { name: 'Prospects', key: 'P' },
  ];
  constructor(private clientsDataService: ClientsDataService) { }

  ngOnInit() {
    this.accountsCategory = this.categories[0];
    this.products$ = this.clientsDataService.getProducts().pipe(
      map((data: any) => (data.response.docs as any[]).map((item: any) => {
        return { ...item };
      }))
    );

  }
}


