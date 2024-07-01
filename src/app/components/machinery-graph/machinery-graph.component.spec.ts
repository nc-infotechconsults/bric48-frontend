import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineryGraphComponent } from './machinery-graph.component';

describe('MachineryGraphComponent', () => {
  let component: MachineryGraphComponent;
  let fixture: ComponentFixture<MachineryGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MachineryGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachineryGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
