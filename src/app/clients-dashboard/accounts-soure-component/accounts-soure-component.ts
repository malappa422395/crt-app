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
        this.sourceAccounts = arrangements?.map((arrange: any) => {
          const matchedAccount = value?.accounts?.find(
            (item: any) =>
              arrange.arrangementIdentifierValue === item.clientAccountNumber
          );
          if (!matchedAccount) {
            return null;
          }
          return {
            // Accounts response fields
            clientAccountNumber: arrange?.arrangementIdentifierValue ?? '--',
            accountName: arrange?.businessUserArrangementName ?? '--',
            friendlyPartyNum: arrange?.primaryPartyFpn ?? '--',
            marketValue: arrange?.marketValueAmount ?? '--',
            faNum: arrange?.faNumber ?? '--',
            productName: arrange?.productName ?? '--',
            marketValueDate: arrange?.marketValueDate ?? '--',

            // Clients response fields
            clientId: value?.clientId ?? '--',
            clientFirstName: value?.clientFirstName ?? '--',
            clientLastName: value?.clientLastName ?? '--',
            clientMiddleName: value?.clientMiddleName ?? '--',
            clientFriendlyPartyNum: value?.friendlyPartyNum ?? '--',
            clientDateOfBirth: value?.clientDateOfBirth ?? '--',
            clientPrefix: value?.clientPrefix ?? '--',
            clientSuffix: value?.clientSuffix ?? '--',
            taxFlag: matchedAccount?.taxFlag ?? '--',

          };
        })?.filter((acc: any) => acc != null);
        this.selectedAccounts = this.sourceAccounts?.filter((acc: any) => acc != null)
          .filter((acc: any, i: number, arr: any[]) => i === arr.findIndex((a: any) => a.clientAccountNumber === acc.clientAccountNumber));
        this.getSelectedAccounts.emit(this.selectedAccounts);
        this.cdr.detectChanges(); // prevent template change errors
      });
  }
  get selectedProducts() {
    return this._selectedProducts;
  }

  // Event: single row selected
  onAccountSelect(event: any) {
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