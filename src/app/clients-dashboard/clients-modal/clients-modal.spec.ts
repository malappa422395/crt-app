import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsModal } from './clients-modal';

describe('ClientsModal', () => {
  let component: ClientsModal;
  let fixture: ComponentFixture<ClientsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientsModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
