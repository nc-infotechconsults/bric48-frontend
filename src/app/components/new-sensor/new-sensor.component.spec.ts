import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSensorComponent } from './new-sensor.component';

describe('NewSensorComponent', () => {
  let component: NewSensorComponent;
  let fixture: ComponentFixture<NewSensorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewSensorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
