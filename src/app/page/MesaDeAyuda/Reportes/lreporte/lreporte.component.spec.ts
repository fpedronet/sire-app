import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LreporteComponent } from './lreporte.component';

describe('LreporteComponent', () => {
  let component: LreporteComponent;
  let fixture: ComponentFixture<LreporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LreporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LreporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
