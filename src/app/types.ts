export interface ClientsPayload {
    authContext: {
        applicationId: string;
        impersonatedUserID: string;
    };
    searchParams: {
        q: string[];
        rows: string[];
        partyEngagementType: string[];
        partyStatus: string[];
        sort: string[];
    };
    serviceContext: {
        timestamp: string;
    };
}

export interface ClientPayloadInputs {
    ntlogin?: string;
    searchText?: string | undefined;
}
export interface AccounstData {
    cert_account_number?: string;
    cert_name?: string;
    cert_istaxreportingholder?: boolean;
    cert_moneymanager?: string;
    cert_accountholder_name?: string;
    'cert_caseid@odata.bind'?: string;
    cert_clientid?: string;
    cert_fpn?: string;
    cert_asofdate?: string;
    cert_valueofaccount?: number;
}
export interface ProspectData {
    clientDateOfBirth: string | number | Date;
    clientFirstName: any; clientLastName: any;
    clientMiddleName: any; clientSuffix: any;
    clientPrefix: any;
    clientId: any; friendlyPartyNum: any;
    legalEntity?: any;
}