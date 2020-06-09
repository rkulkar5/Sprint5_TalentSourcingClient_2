import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowConfigComponent } from './workflow-config.component';

describe('WorkflowConfigComponent', () => {
  let component: WorkflowConfigComponent;
  let fixture: ComponentFixture<WorkflowConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
