import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMachineryComponent } from './new-machinery.component';

describe('NewMachineryComponent', () => {
  let component: NewMachineryComponent;
  let fixture: ComponentFixture<NewMachineryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewMachineryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewMachineryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
