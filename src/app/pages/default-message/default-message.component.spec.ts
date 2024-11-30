import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaComponent } from './default-message.component';

describe('AreaComponent', () => {
  let component: AreaComponent;
  let fixture: ComponentFixture<AreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
