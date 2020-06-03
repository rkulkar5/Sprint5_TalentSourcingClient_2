import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsCandidateListComponent } from './operations-candidate-list.component';

describe('OperationsCandidateListComponent', () => {
  let component: OperationsCandidateListComponent;
  let fixture: ComponentFixture<OperationsCandidateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationsCandidateListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsCandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
