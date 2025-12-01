import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectDashboard } from './prospect-dashboard';

describe('ProspectDashboard', () => {
  let component: ProspectDashboard;
  let fixture: ComponentFixture<ProspectDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProspectDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProspectDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
