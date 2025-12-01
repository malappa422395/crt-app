import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectTable } from './prospect-table';

describe('ProspectTable', () => {
  let component: ProspectTable;
  let fixture: ComponentFixture<ProspectTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProspectTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProspectTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
