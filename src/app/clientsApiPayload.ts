import { ClientPayloadInputs, ClientsPayload } from "./types";

export const getClientsPayload = (clientPayloadInputs: ClientPayloadInputs): ClientsPayload => ({
    authContext: {
        applicationId: "ClientCenter",
        impersonatedUserID: clientPayloadInputs?.ntlogin ?? ""
    },
    searchParams: {
        q: [
            "o"
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