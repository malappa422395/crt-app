import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-accounts-soure-component',
  imports: [CommonModule, TableModule],
  templateUrl: './accounts-soure-component.html',
  styleUrl: './accounts-soure-component.scss',
})
export class AccountsSoureComponent {

  @Input() selectedProducts: any;
  readonly getSelectedAccounts = output<any>();
  selectedAccounts!: any[];

  onAccountSelect(event: any) {
    this.selectedAccounts = [];
    this.selectedAccounts.push(event);
    this.getSelectedAccounts.emit(this.selectedAccounts);
  }
  onSelectAll(event: { originalEvent: Event; checked: boolean }) {
    console.log('Select all toggled:', event.checked);
    console.log('Event details:', event);
    if (event.checked) {
      this.selectedAccounts = [...this.selectedProducts?.accounts];
    } else {
      this.selectedAccounts = [];
    }
    this.getSelectedAccounts.emit(this.selectedAccounts);
  }
}
