import { ClientPayloadInputs, ClientsPayload } from "./types";

export const getProspectPayload = (clientPayloadInputs: ClientPayloadInputs): ClientsPayload => ({
    authContext: {
        applicationId: "ClientCenter",
        impersonatedUserID: clientPayloadInputs?.ntlogin ?? ""
    },
    searchParams: {
        q: [
            clientPayloadInputs?.searchText ?? "o"
        ],
        rows: [
            "2000"
        ],
        partyEngagementType: [
            "Prospect"
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