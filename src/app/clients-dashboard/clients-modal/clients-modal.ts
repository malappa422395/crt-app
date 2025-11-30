import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-clients-modal',
  imports: [DialogModule, ButtonModule, TableModule],
  templateUrl: './clients-modal.html',
  styleUrl: './clients-modal.scss',
})
export class ClientsModal implements OnInit {

  @Input() visible: any;
  @Output() openModal = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();
  @Output() getSelectedClient = new EventEmitter<any>();
  @Input() clients: any[] = [];
  selectedClient: any;
  ngOnInit() {
    this.selectedClient = this.clients[0];
    this.onRowSelect({ data: this.clients[0] });
  }
  closeDialog() {
    this.visible = false;
    this.closeModal.emit(this.visible);
  }

  openDialog() {
    this.visible = true;
    this.openModal.emit(this.visible);
  }
  onHide() {
    this.closeModal.emit(this.visible);
  }

  createCase() {
    console.log('Creating case for selected client:', this.selectedClient);
    this.getSelectedClient.emit(this.selectedClient);
    this.closeDialog();
    // Implement case creation logic here
  }
  onRowSelect(event: any) {
    this.selectedClient = event.data;
  }
}
