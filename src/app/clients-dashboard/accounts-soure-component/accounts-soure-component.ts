import { CommonModule } from '@angular/common';
import { Component, Input, output, ChangeDetectorRef } from '@angular/core';
import { TableModule } from 'primeng/table';
import { take } from 'rxjs/operators';
import { ClientsDataService } from '../clients-data-service';

@Component({
  selector: 'app-accounts-soure-component',
  imports: [CommonModule, TableModule],
  templateUrl: './accounts-soure-component.html',
  styleUrls: ['./accounts-soure-component.scss'],
})
export class AccountsSoureComponent {
  private _selectedProducts: any;
  // Output event (Angular 17+)
  readonly getSelectedAccounts = output<any[]>();
  sourceAccounts: any[] = [];
  selectedAccounts: any[] = [];
  constructor(
    private clientsDataService: ClientsDataService,
    private cdr: ChangeDetectorRef
  ) { }
  @Input()
  set selectedProducts(value: any) {
    if (!value || !value.accounts) {
      this._selectedProducts = value;
      this.sourceAccounts = [];
      return;
    }
    // Prevent repeating API calls if accounts haven't changed
    if (JSON.stringify(value?.accounts) === JSON.stringify(this._selectedProducts?.accounts)) {
      return;
    }
    this._selectedProducts = value;
    const accountNumbers =
      value.accounts.map((acc: any) => acc.clientAccountNumber) ?? [];
    if (accountNumbers.length === 0) {
      this.sourceAccounts = [];
      return;
    }
    this.getAccountsMarketValue(accountNumbers)
      .pipe(take(1))
      .subscribe((accountsWithMVData: any) => {
        const arrangements = accountsWithMVData?.arrangements ?? [];
        this.sourceAccounts = value.accounts.map((acc: any) => {
          const matchedAccount = arrangements.find(
            (item: any) =>
              item.key.arrangementIdentifierValue === acc.clientAccountNumber
          );
          return {
            clientAccountNumber: acc.clientAccountNumber,
            clientAccountName: acc.clientAccountName,
            taxFlag: acc.taxFlag,
            marketValue: matchedAccount?.marketValue?.amount ?? '--',
            clientId: value.clientId,
            clientFirstName: value.clientFirstName,
            clientLastName: value.clientLastName,
            clientMiddleName: value.clientMiddleName ?? '--',
            friendlyPartyNum: value.friendlyPartyNum,
            faNum: matchedAccount?.businessRep?.faNumber ?? '--',
          };
        });
        this.cdr.detectChanges(); // prevent template change errors
      });
  }
  get selectedProducts() {
    return this._selectedProducts;
  }
  // Event: single row selected
  onAccountSelect(event: any) {
    this.selectedAccounts = [event];
    this.getSelectedAccounts.emit(this.selectedAccounts);
  }
  // Event: select all rows
  onSelectAll(event: { originalEvent: Event; checked: boolean }) {
    this.selectedAccounts = event.checked ? [...this.sourceAccounts] : [];
    this.getSelectedAccounts.emit(this.selectedAccounts);
  }
  getAccountsMarketValue(accountNumbers: string[]) {
    return this.clientsDataService.getAccountsWithMarketValue(accountNumbers);
  }
}