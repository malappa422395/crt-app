import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-prospect-form',
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule],
  templateUrl: './prospect-form.html',
  styleUrl: './prospect-form.scss'
})
export class ProspectForm {
  @Output() prospectSubmit = new EventEmitter();

  client = {
    clientFirstName: '',
    clientLastName: '',
    clientMiddleName: ''
  };
  submitForm(clientForm: any) {
    console.log('Submitted:', this.client);
    this.prospectSubmit.emit(this.client);
    clientForm.reset();
  }

  resetForm(form: any) {
    form.reset();
  }

}
