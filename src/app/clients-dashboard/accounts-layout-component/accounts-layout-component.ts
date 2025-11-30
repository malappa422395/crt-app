import { Component, Input } from '@angular/core';
import { AccountsSoureComponent } from "../accounts-soure-component/accounts-soure-component";
import { AccountsTargetComponent } from "../accounts-target-component/accounts-target-component";
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ClientsModal } from '../clients-modal/clients-modal';

@Component({
  selector: 'app-accounts-layout-component',
  imports: [AccountsSoureComponent, AccountsTargetComponent, ButtonModule, CommonModule],
  templateUrl: './accounts-layout-component.html',
  styleUrls: ['./accounts-layout-component.scss']
})
export class AccountsLayoutComponent {
  @Input() selectedProducts: any;
  selectedAccounts: any;
  targetAccounts: Array<any> = [];
  selectedTargetAccounts: any;
  addAccounts() {
    this.targetAccounts = [
      ...this.targetAccounts,
      ...(this.selectedAccounts ?? [])
    ]
      .filter(acc => acc) // remove null/undefined
      .filter(
        (acc, index, self) =>
          index === self.findIndex(a => a.clientAccountNumber === acc.clientAccountNumber)
      );
  }
  removeAccounts(product: any) {
    this.selectedProducts = product;
  }
  getSelectedAccounts(event: any) {
    this.selectedAccounts = event;
  }
  getSelectedTargetAccounts(event: any) {
    console.log(event);
    this.selectedTargetAccounts = event;
  }

  removeTargetAccounts() {
    console.log(this.selectedTargetAccounts);
    this.targetAccounts = this.targetAccounts.filter(
      acc => !this.selectedTargetAccounts?.some((selAcc: any) => selAcc.clientAccountNumber === acc.clientAccountNumber)
    );
  }
}
