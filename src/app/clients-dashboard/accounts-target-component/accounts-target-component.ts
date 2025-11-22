import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-accounts-target-component',
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './accounts-target-component.html',
  styleUrl: './accounts-target-component.scss'
})
export class AccountsTargetComponent {
 @Input() targetAccounts: any;
 selectedTargetAccounts!: any[];
 readonly getSelectedTargetAccounts = output<any>();
 onAccountSelect(event: any) {
    this.selectedTargetAccounts = event;
    this.getSelectedTargetAccounts.emit(this.selectedTargetAccounts);
  }
  createCases() {
    console.log('Creating cases for selected accounts:', this.selectedTargetAccounts);
    // Implement case creation logic here
  }
}
