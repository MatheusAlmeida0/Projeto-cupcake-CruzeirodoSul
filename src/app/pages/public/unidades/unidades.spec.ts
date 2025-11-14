import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesComponent } from './unidades';

describe('Unidades', () => {
  let component: UnidadesComponent;
  let fixture: ComponentFixture<UnidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnidadesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
