import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcajachicaComponent } from './lcajachica.component';

describe('LcajachicaComponent', () => {
  let component: LcajachicaComponent;
  let fixture: ComponentFixture<LcajachicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcajachicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LcajachicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
