import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ProspectTable } from "./prospect-table/prospect-table";

@Component({
  selector: 'app-prospect-dashboard',
  imports: [ProspectTable],
  templateUrl: './prospect-dashboard.html',
  styleUrl: './prospect-dashboard.scss'
})
export class ProspectDashboard {
  
  constructor() { }
  
}
