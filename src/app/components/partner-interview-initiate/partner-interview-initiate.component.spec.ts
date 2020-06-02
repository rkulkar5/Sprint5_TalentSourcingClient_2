import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerInterviewInitiateComponent } from './partner-interview-initiate.component';

describe('PartnerInterviewInitiateComponent', () => {
  let component: PartnerInterviewInitiateComponent;
  let fixture: ComponentFixture<PartnerInterviewInitiateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerInterviewInitiateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerInterviewInitiateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
