import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineriesListComponent } from './machineries-list.component';

describe('MachineriesListComponent', () => {
  let component: MachineriesListComponent;
  let fixture: ComponentFixture<MachineriesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MachineriesListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachineriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
