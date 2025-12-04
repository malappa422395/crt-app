import { ClientPayloadInputs, ClientsPayload } from "./types";

export const getClientsPayload = (clientPayloadInputs: ClientPayloadInputs): ClientsPayload => ({
    authContext: {
        applicationId: "ClientCenter",
        impersonatedUserId: clientPayloadInputs?.ntlogin ?? ""
    },
    searchParams: {
        q: [
            clientPayloadInputs?.searchText ?? ""
        ],
        rows: [
            "2000"
        ],
        partyEngagementType: [
            "Client"
        ],
        partyStatus: [
            "Active"
        ],
        sort: [
            "clientLastName asc,clientFirstName asc,contactDisplayName asc"
        ]
    },
    serviceContext: {
        timestamp: new Date().toISOString()
    }
});