import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerInterviewComponent } from './partner-interview.component';

describe('PartnerInterviewComponent', () => {
  let component: PartnerInterviewComponent;
  let fixture: ComponentFixture<PartnerInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
