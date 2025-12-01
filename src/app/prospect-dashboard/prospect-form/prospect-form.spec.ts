import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectForm } from './prospect-form';

describe('ProspectForm', () => {
  let component: ProspectForm;
  let fixture: ComponentFixture<ProspectForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProspectForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProspectForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
