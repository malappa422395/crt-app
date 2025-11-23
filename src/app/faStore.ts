import { Injectable, signal } from '@angular/core';

export interface faParameters {
    cId?: string,
    cssId?: string,
    pId?: string,
    ntlogin?: string,
    clientBaseUrl?: string,
    prospectBaseUrl?: string,
    globalContextUrl?: string,
    accountBaseUrl?: string
}

@Injectable({ providedIn: 'root' })
export class FaUserStore {
    faUser:any = signal<faParameters | null>(null);
    setUser(faUser: faParameters) {
        this.faUser.set(faUser);
    }
    clear() {
        this.faUser.set(null);
    }
}
