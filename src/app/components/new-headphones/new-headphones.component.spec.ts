import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHeadphonesComponent } from './new-headphones.component';

describe('NewHeadphonesComponent', () => {
  let component: NewHeadphonesComponent;
  let fixture: ComponentFixture<NewHeadphonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewHeadphonesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewHeadphonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
