import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsProjectInitiateComponent } from './operations-project-initiate.component';

describe('OperationsProjectInitiateComponent', () => {
  let component: OperationsProjectInitiateComponent;
  let fixture: ComponentFixture<OperationsProjectInitiateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsProjectInitiateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsProjectInitiateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
