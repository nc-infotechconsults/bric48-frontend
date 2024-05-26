import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineryBarComponent } from './machinery-bar.component';

describe('MachineryBarComponent', () => {
  let component: MachineryBarComponent;
  let fixture: ComponentFixture<MachineryBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MachineryBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachineryBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
