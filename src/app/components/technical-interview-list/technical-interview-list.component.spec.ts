import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalInterviewListComponent } from './technical-interview-list.component';

describe('TechnicalInterviewListComponent', () => {
  let component: TechnicalInterviewListComponent;
  let fixture: ComponentFixture<TechnicalInterviewListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalInterviewListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalInterviewListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
