import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsTargetComponent } from './accounts-target-component';

describe('AccountsTargetComponent', () => {
  let component: AccountsTargetComponent;
  let fixture: ComponentFixture<AccountsTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsTargetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
