import { Component, OnInit } from '@angular/core';
import { TableModule } from "primeng/table";
import { map, Observable } from 'rxjs';
import { faParameters, FaUserStore } from '../../faStore';
import { ProspectDataService } from '../prospect-data-service';
import { CommonModule } from '@angular/common';
import { ClientsPayload, ProspectData } from '../../types';
import { getProspectPayload } from '../../prospectApiPayload';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MoneyManagerAccountService } from '../../clients-dashboard/money-manager-account.service';
import { ProspectForm } from "../prospect-form/prospect-form";
declare var Xrm: any;
@Component({
  selector: 'app-prospect-table',
  imports: [CommonModule, FormsModule, TableModule, InputTextModule, ButtonModule, TableModule, ProspectForm],
  templateUrl: './prospect-table.html',
  styleUrl: './prospect-table.scss'
})
export class ProspectTable implements OnInit {
  prospects: Array<any> = [];
  prospects$!: Observable<any[]>;
  selectedProspect!: any;
  searchText: string = '';
  isAddNewProspectFormVisible: boolean = false;
  faUserParams: faParameters | null = null;;
  constructor(private prospectsDataService: ProspectDataService, private faUserStore: FaUserStore, private MMAService: MoneyManagerAccountService) {
    this.faUserParams = this.faUserStore.faUser();
  }
  ngOnInit() {
    this.reloadProspectsDefault()
  }

  getProspects(clientsPayload: any) {
    this.prospects$ = this.prospectsDataService.getProspects(clientsPayload).pipe(
      map((data: any) => (data.response.docs as any[]).map((item: any) => {
        return { ...item };
      }))
    );
  }

  getProspectPayloadCrieria(searchText: string) {
    console.log('Searching prospects for:', searchText);
    const clientsPayload: ClientsPayload = getProspectPayload({ ntlogin: this.faUserParams?.ntlogin ?? '', searchText: searchText });
    this.getProspects(clientsPayload);
    this.searchText = '';
  }

  applyProspectSearch() {
    const input = this.searchText.trim().toLowerCase();
    if (!input) {
      alert('Please enter a valid search input.');
      return;
    }
    // Account number pattern: 3 digits + 2 alphanumeric + 3 digits
    const accountPattern = /^\d{3}[A-Za-z0-9]{2}\d{3}$/;
    if (accountPattern.test(input)) {
      console.log('Account number search:', input);
      this.getProspectPayloadCrieria(input)
      return;
    }
    const nameParts = input.split(',').map(p => p.trim());
    if (nameParts.length === 1) {
      console.log('Partial last name search:', nameParts[0]);
      this.getProspectPayloadCrieria(nameParts[0])
      return;
    } else if (nameParts.length === 2) {
      console.log('Full name search - Last Name:', nameParts[0], 'First Name:', nameParts[1]);
      this.getProspectPayloadCrieria(nameParts[0] + ', ' + nameParts[1])
      return
    }
  }
  reloadProspectsDefault() {
    const clientsPayload: ClientsPayload = getProspectPayload({ ntlogin: this.faUserParams?.ntlogin ?? '', searchText: "o" });
    this.getProspects(clientsPayload);
    this.searchText = '';
  }

  createProspectCase(selectedProspectRowData: any, cssId: string, contactId: string) {
    let prospectTitle = '';
    let prospectName = '';
    if (this.selectedProspect.clientLastName) {
      prospectTitle = this.selectedProspect.clientLastName + ', ' + this.selectedProspect.clientFirstName + " - " + cssId;
      prospectName = this.selectedProspect.clientLastName + ', ' + this.selectedProspect.clientFirstName;
    } else {
      let firstORCompanyName = '';
      if (this.selectedProspect.clientFirstName) {
        firstORCompanyName = this.selectedProspect.clientFirstName;
      } else {
        firstORCompanyName = this.selectedProspect.legalEntity ? this.selectedProspect.legalEntity : '';
      }
      prospectTitle = firstORCompanyName + " - " + cssId;
      prospectName = firstORCompanyName;
    }
    const caseData =
    {
      "cert_title": prospectTitle,
      "cert_financialadvisorid@odata.bind": "/contacts(" + contactId + ")",
      "cert_clientid": selectedProspectRowData.clientId,
      "cert_prospect_name": prospectName,
      "cert_fpn": selectedProspectRowData.friendlyPartyNum,
      //"cert_totalmarketvalue": this.totalMarketValue

    }
    // create bidsL client record
    Xrm.WebApi.createRecord("cert_case", caseData).then(
      (result: { id: string; }) => {
        console.log("Case created with ID: " + result.id);
        this.createProspect(selectedProspectRowData, result.id);//cert_clienttype : 690480001
        this.OpenCaseForm(result.id);
      },
      (error: { message: any; }) => {
        console.log(error.message);
        // handle error conditions
      }
    );
  }

  OpenCaseForm(caseId: any) {
    const entityFormOptions: any = {};
    entityFormOptions["entityName"] = "cert_case";
    entityFormOptions["entityId"] = caseId;

    // Open the form.
    Xrm.Navigation.openForm(entityFormOptions).then(
      (success: any) => {
        console.log(success);
      },
      (error: any) => {
        console.log(error);
      });
  }
  createProspect(prospectClient: ProspectData, caseId: string) {
    let dob = '';
    if (prospectClient.clientDateOfBirth) {
      const date = new Date(prospectClient.clientDateOfBirth);
      dob = (date.getMonth() + 1) + '/' + date.getFullYear()
    }

    const prospectData =
    {
      "cert_dob": dob,
      "cert_firstname": prospectClient.clientFirstName,
      "cert_name": prospectClient.clientLastName,
      "cert_middlename": prospectClient.clientMiddleName,
      "cert_suffix": prospectClient.clientSuffix,
      "cert_clientid": prospectClient.clientId,//check for null
      "cert_fpn": prospectClient.friendlyPartyNum,//check for null
      "cert_clienttype": 690480001,
      "cert_prefix": prospectClient.clientPrefix,
      "cert_caseid@odata.bind": "/cert_cases(" + caseId + ")"
    }
    // create bidsL client record
    Xrm.WebApi.createRecord("cert_clientprospect", prospectData).then(
      (result: { id: string; }) => {
        console.log("Client created with ID: " + result.id);
        // perform operations on record creation
      },
      (error: { message: any; }) => {
        console.log(error.message);
        // handle error conditions
      }
    );
  }

  createProspectRecord() {
    console.log('Creating prospect for:', this.selectedProspect);
    if (!this.selectedProspect) {
      alert('No prospect selected to create case.');
      return;
    }
    // Implement the logic to create a prospect here
    if (this.faUserParams) {
      const contactId = this.faUserParams?.cId;
      const cssId = this.faUserParams?.cssId;
      this.MMAService.CRM_BASE_URL = this.faUserParams?.globalContextUrl ?? '';
      let certtitle: string = '';
      if (this.selectedProspect) {
        if (this.selectedProspect.clientLastName) {
          certtitle = this.selectedProspect.clientLastName + ', ' + this.selectedProspect.clientFirstName + " - " + cssId;
        } else {
          let firstORCompanyName = '';
          if (this.selectedProspect.clientFirstName) {
            firstORCompanyName = this.selectedProspect.clientFirstName
          } else {
            firstORCompanyName = this.selectedProspect.legalEntity ? this.selectedProspect.legalEntity : '';
          }
          certtitle = firstORCompanyName + " - " + cssId;
        }
      }
      if (certtitle) {
        this.MMAService.isDuplicateCase(certtitle).subscribe((response: any) => {
          if (response && response.value) {
            const isduplicate = response.value.find((obj: any) => {
              if (obj && obj.cert_title === certtitle) {
                return obj;
              }
            })
            if (isduplicate) {
              alert("A case already exist.")
            } else {
              if (this.selectedProspect) {
                if (!contactId) {
                  console.warn("Missing contactId, cannot create case.");
                } else if (!cssId) {
                  console.warn("Missing cssId, cannot create case.");
                } else {
                  // ensure cssId is a string when calling CreateCase
                  this.createProspectCase(this.selectedProspect, cssId, contactId);
                  console.log("Record creation Process completed");
                }
              }
            }
          }
        }, (error) => {
          console.error("Error checking for duplicate case.", error);
        });
      }
    }
  }

  // Add new prospect logic here
  addNewProspect() {
    console.log('Add New Prospect button clicked');
    // You can open a dialog or navigate to a new form for adding a prospect
    this.isAddNewProspectFormVisible = true;
  }
  backNavigation() {
    console.log('Back Navigation button clicked');
    this.isAddNewProspectFormVisible = false;
  }

  prospectSubmit(prospectForm: any) {
    console.log("test", prospectForm)
    const newProspect = {
      clientDateOfBirth: '',
      clientFirstName: prospectForm.clientFirstName,
      clientLastName: prospectForm.clientLastName,
      clientMiddleName: prospectForm.clientMiddleName,
      clientSuffix: '',
      clientPrefix: ''
    }
    this.selectedProspect = newProspect;
    this.OnSubmitRecords()
  }
  OnSubmitRecords() {
    this.createProspectRecord();
  }
}
