import { Component, Input } from '@angular/core';
import { AccountsSoureComponent } from "../accounts-soure-component/accounts-soure-component";
import { AccountsTargetComponent } from "../accounts-target-component/accounts-target-component";
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accounts-layout-component',
  imports: [AccountsSoureComponent, AccountsTargetComponent, ButtonModule, CommonModule],
  templateUrl: './accounts-layout-component.html',
  styleUrl: './accounts-layout-component.scss'
})
export class AccountsLayoutComponent {
  @Input() selectedProducts: any;
  selectedAccounts: any;
  targetAccounts: Array<any> = [];
  addAccounts() {
    this.targetAccounts = [...this.targetAccounts, ...this.selectedAccounts];
    this.selectedAccounts = null;
  }
  removeAccounts(product: any) {
    this.selectedProducts = product;
  }
  getSelectedAccounts(event: any) {
    this.selectedAccounts = event;
  }
  getSelectedTargetAccounts(event: any) {
   console.log(event);
  }
}
