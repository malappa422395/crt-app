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
}