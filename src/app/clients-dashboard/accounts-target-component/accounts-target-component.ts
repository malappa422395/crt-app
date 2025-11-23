import { CommonModule } from '@angular/common';
import { Component, Input, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { faParameters, FaUserStore } from '../../faStore';
import { MoneyManagerAccountService } from '../money-manager-account.service';
declare var Xrm: any;
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
  faUserParams: faParameters | null = null;
  selectedRowData: any;
  clients: any[] = [];
  constructor(private faUserStore: FaUserStore, private MMAService: MoneyManagerAccountService) {
    this.faUserParams = this.faUserStore.faUser();
  }
  onAccountSelect(event: any) {
    this.selectedTargetAccounts = event;
    this.getSelectedTargetAccounts.emit(this.selectedTargetAccounts);
  }
  createCases() {
    console.log('Creating cases for selected accounts:', this.selectedTargetAccounts);
    this.clients = [
      ...new Map(
        this.selectedTargetAccounts?.map(acc => [acc.clientId, acc])
      ).values()
    ];
    // Implement case creation logic here
    this.CreateRecord();
  }
  CreateRecord() {
    console.log("Filtered the Relationship collection with selected Account number");
    console.log("Record creation Process Started");
    if (this.faUserParams) {
      const contactId = this.faUserParams?.cId;
      const cssId = this.faUserParams?.cssId;
      this.MMAService.CRM_BASE_URL = this.faUserParams?.globalContextUrl ?? '';
      let certtitle: string = '';
      this.selectedRowData = this.selectedTargetAccounts?.[0];
      if (this.selectedRowData) {
        if (this.selectedRowData.clientLastName) {
          certtitle = this.selectedRowData.clientLastName + ', ' + this.selectedRowData.clientFirstName + " - " + cssId;
        } else {
          certtitle = this.selectedRowData.clientFirstName ? this.selectedRowData.clientFirstName : '' + " - " + cssId;
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
              if (this.selectedRowData && this.selectedTargetAccounts) {
                if (!contactId) {
                  console.warn("Missing contactId, cannot create case.");
                } else {
                  // ensure cssId is a string when calling CreateCase
                  this.CreateCase(cssId ?? '', contactId, this.selectedTargetAccounts);
                  console.log("Record creation Process completed");
                }
              }
            }
          }
        })
      }
    }
  }

  createProspect(prospectClient: { clientDateOfBirth: string | number | Date; clientFirstName: any; clientLastName: any; clientMiddleName: any; clientSuffix: any; clientPrefix: any; }, caseId: string) {
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

  CreateCase(cssid: string, faId: string, targetAccounts: any[] | null) {
    let title = '';
    if (this.selectedRowData.clientLastName) {
      title = this.selectedRowData.clientLastName + ', ' + this.selectedRowData.clientFirstName + " - " + cssid;
    } else {
      title = this.selectedRowData.clientFirstName + " - " + cssid;
    }
    const secondaryClients = this.selectedTargetAccounts?.filter((acc: any) => acc.clientId !== this.selectedRowData.clientId)
    const secondaryClientIds = secondaryClients?.map((acc: any) => acc.clientId).join(' : ');
    const friendlyPartyNum = secondaryClients?.map((acc: any) => acc.clientFriendlyPartyNum).join(' : ');
    const totalMarketValue = this.selectedTargetAccounts?.reduce((acc: number, curr: any) => acc + parseFloat(curr.marketValue), 0);
    console.log("Total Market Value: " + totalMarketValue);
    const caseData =
    {
      "cert_title": title,
      "cert_financialadvisorid@odata.bind": "/contacts(" + faId + ")",
      "cert_primary_clientid": this.selectedRowData.clientId,
      "cert_fpn": this.selectedRowData.clientFriendlyPartyNum,
      "cert_secondary_clientid": secondaryClientIds,//only if there are multiple clients selected. clientid seperated by ;
      "cert_secondaryclient_fpn": friendlyPartyNum, //only if there are multiple clients selected. friendlyPartyNum seperated by ;
      // "cert_totalmarketvalue": totalMarketValue
    }
    // create bidsL client record
    Xrm.WebApi.createRecord("cert_case", caseData).then(
      (result: { id: string; }) => {
        console.log("Case created with ID: " + result.id);
        this.CreateAccount(targetAccounts, result.id);
        this.createClient(this.clients, result.id);
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

  CreateAccount(targetAccounts: any[] | null, caseId: string) {
    console.log("Account Creation Started");

    if (targetAccounts != null && targetAccounts.length > 0) {
      targetAccounts.forEach((accountObj: any) => {
        let certAccountholderName = '';
        if (accountObj?.friendlyPartyNum === accountObj?.clientFriendlyPartyNum) {
          certAccountholderName = accountObj.clientFirstName + ',' + accountObj.clientLastName;
        }
        const accountData =
        {
          "cert_account_number": accountObj.clientAccountNumber,
          "cert_asofdate": accountObj.marketValueDate,
          "cert_valueofaccount": parseFloat(accountObj.marketValue),
          "cert_name": accountObj.accountName,
          "cert_istaxreportingholder": parseInt(accountObj?.taxFlag),
          "cert_moneymanager": accountObj.productName,
          "cert_accountholder_name": certAccountholderName,
          "cert_caseid@odata.bind": "/cert_cases(" + caseId + ")"
        }
        // create bidsL account record
        Xrm.WebApi.createRecord("cert_account", accountData).then(
          (result: { id: string; }) => {
            console.log("Account created with ID: " + result.id);
            // perform operations on record creation
          },
          (error: { message: any; }) => {
            console.log(error.message);
            // handle error conditions
          }
        );
      })


    }
    console.log("Account Creation Completed");
  }
  createClient(clients: any[], caseId: string) {
    if (clients && clients.length > 0) {
      clients.forEach((clientObj: any) => {
        let dob = '';
        if (clientObj.clientDateOfBirth) {
          const date = new Date(clientObj.clientDateOfBirth);
          dob = (date.getMonth() + 1) + '/' + date.getFullYear()
        }
        const clientData =
        {
          "cert_dob": dob,//"1947-11-21T00:00:00Z" but we need Month/year only
          "cert_firstname": clientObj.clientFirstName,
          "cert_name": clientObj.clientLastName,
          "cert_middlename": clientObj.clientMiddleName,//check for null
          "cert_suffix": clientObj.clientSuffix,//check for null
          "cert_prefix": clientObj.clientPrefix,//check for null
          "cert_clientid": clientObj.clientId,//check for null
          "cert_fpn": clientObj.clientFriendlyPartyNum,//check for null
          "cert_clienttype": 690480000,
          "cert_caseid@odata.bind": "/cert_cases(" + caseId + ")"
        }
        Xrm.WebApi.createRecord("cert_clientprospect", clientData).then(
          (result: { id: string; }) => {
            console.log("Client created with ID: " + result.id);
            // perform operations on record creation
          },
          (error: { message: any; }) => {
            console.log(error.message);
            // handle error conditions
          }
        );
      })
    }
  }

}
