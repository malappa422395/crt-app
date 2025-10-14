import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsSoureComponent } from './accounts-soure-component';

describe('AccountsSoureComponent', () => {
  let component: AccountsSoureComponent;
  let fixture: ComponentFixture<AccountsSoureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountsSoureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsSoureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
