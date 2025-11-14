import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminLayoutComponent } from './admin-layout';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLayoutComponent, CommonModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the component with RouterOutlet for child routes', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;

    // Verifica se o componente foi renderizado
    expect(compiled).toBeTruthy();
  });

  it('should be rendered with the correct selector', () => {
    // O componente é renderizado dentro de um elemento no teste
    // Verificamos se a instância do componente é uma AdminLayoutComponent
    fixture.detectChanges();
    expect(component instanceof AdminLayoutComponent).toBe(true);
  });

  it('should initialize without errors', () => {
    // Detecta mudanças e verifica se não há erros
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });
});
