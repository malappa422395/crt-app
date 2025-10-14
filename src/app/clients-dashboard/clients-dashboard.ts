import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ClientsDataService } from './clients-data-service';
import { clientsAccounts } from './types/clientsAccounts';
import { map, Observable, from } from 'rxjs';
import { AccountsSoureComponent } from "./accounts-soure-component/accounts-soure-component";
import { AccountsLayoutComponent } from "./accounts-layout-component/accounts-layout-component";
@Component({
  selector: 'app-clients-dashboard',
  imports: [CommonModule, TableModule, AccountsLayoutComponent],
  templateUrl: './clients-dashboard.html',
  styleUrl: './clients-dashboard.scss'
})

export class ClientsDashboard {

  products: Array<any> = [];
  products$!: Observable<any[]>;
  selectedProducts!: any;
  
  constructor(private clientsDataService: ClientsDataService) { }

  ngOnInit() {
    this.products$ = from(this.clientsDataService.getProducts()).pipe(
      map((data: any) => (data.docs as any[]).map((item: any) => {
        return { ...item };
      }))
    );
  }
}
    

