import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProdutoFormComponent } from './produto-form';
import { ApiService } from '../../../services/api';
import { NotificationService } from '../../../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';

describe('ProdutoFormComponent', () => {
  let component: ProdutoFormComponent;
  let fixture: ComponentFixture<ProdutoFormComponent>;
  let mockApiService: any;
  let mockNotificationService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    // Mock services
    mockApiService = jasmine.createSpyObj('ApiService', [
      'getProdutoById',
      'createProduto',
      'updateProduto',
    ]);

    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
    ]);

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [ProdutoFormComponent, ReactiveFormsModule, CommonModule],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize produtoForm with empty values and validators', () => {
    expect(component.produtoForm).toBeDefined();
    expect(component.produtoForm.get('nome')).toBeDefined();
    expect(component.produtoForm.get('valor')).toBeDefined();
    expect(component.produtoForm.get('caminho_imagem')).toBeDefined();
  });

  it('should have isEditMode as false when no produtoId is provided', () => {
    fixture.detectChanges();
    expect(component.isEditMode).toBe(false);
  });

  it('should load produto data when produtoId is provided in route params', () => {
    const mockProduto = {
      nome: 'Cupcake Chocolate',
      peso: 100,
      ingredientes: 'chocolate, açúcar',
      valor: 5.0,
      contem_gluten: false,
      contem_lactose: false,
      contem_leite: false,
      contem_amendoim: false,
      caminho_imagem: '/images/cupcake.png',
    };

    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
    mockApiService.getProdutoById.and.returnValue(of(mockProduto));

    fixture.detectChanges();

    expect(component.isEditMode).toBe(true);
    expect(component.produtoId).toBe('1');
    expect(mockApiService.getProdutoById).toHaveBeenCalledWith('1');
    expect(component.produtoForm.get('nome')?.value).toBe('Cupcake Chocolate');
  });

  it('should set errorMessage when loading produto fails', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
    mockApiService.getProdutoById.and.returnValue(throwError(() => new Error('API Error')));

    fixture.detectChanges();

    expect(component.errorMessage).toBe('Erro ao carregar o produto.');
    expect(component.isLoading).toBe(false);
  });

  it('should not submit form if validation fails', () => {
    component.produtoForm.patchValue({
      nome: '',
      valor: 0,
      caminho_imagem: '',
    });

    component.onSubmit();

    expect(mockNotificationService.showSuccess).toHaveBeenCalled();
    expect(mockApiService.createProduto).not.toHaveBeenCalled();
  });

  it('should create new produto when form is valid and not in edit mode', () => {
    const mockProduto = {
      nome: 'Novo Cupcake',
      peso: 100,
      ingredientes: 'ingredientes',
      valor: 10.0,
      contem_gluten: false,
      contem_lactose: false,
      contem_leite: false,
      contem_amendoim: false,
      caminho_imagem: '/images/novo.png',
    };

    component.produtoForm.patchValue(mockProduto);
    mockApiService.createProduto.and.returnValue(of({}));

    component.onSubmit();

    expect(mockApiService.createProduto).toHaveBeenCalledWith(mockProduto);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith('Produto criado com sucesso!');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/produtos']);
  });

  it('should update produto when form is valid and in edit mode', () => {
    const mockProduto = {
      nome: 'Cupcake Atualizado',
      peso: 150,
      ingredientes: 'ingredientes atualizados',
      valor: 12.0,
      contem_gluten: false,
      contem_lactose: false,
      contem_leite: false,
      contem_amendoim: false,
      caminho_imagem: '/images/atualizado.png',
    };

    component.produtoId = '1';
    component.isEditMode = true;
    component.produtoForm.patchValue(mockProduto);
    mockApiService.updateProduto.and.returnValue(of({}));

    component.onSubmit();

    expect(mockApiService.updateProduto).toHaveBeenCalledWith('1', mockProduto);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
      'Produto atualizado com sucesso!'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/produtos']);
  });

  it('should handle error when creating produto fails', () => {
    const mockProduto = {
      nome: 'Novo Cupcake',
      peso: 100,
      ingredientes: 'ingredientes',
      valor: 10.0,
      contem_gluten: false,
      contem_lactose: false,
      contem_leite: false,
      contem_amendoim: false,
      caminho_imagem: '/images/novo.png',
    };

    component.produtoForm.patchValue(mockProduto);
    mockApiService.createProduto.and.returnValue(throwError(() => new Error('API Error')));

    component.onSubmit();

    expect(component.errorMessage).toBe('Erro ao criar o produto.');
    expect(component.isLoading).toBe(false);
  });

  it('should handle error when updating produto fails', () => {
    const mockProduto = {
      nome: 'Cupcake Atualizado',
      peso: 150,
      ingredientes: 'ingredientes atualizados',
      valor: 12.0,
      contem_gluten: false,
      contem_lactose: false,
      contem_leite: false,
      contem_amendoim: false,
      caminho_imagem: '/images/atualizado.png',
    };

    component.produtoId = '1';
    component.isEditMode = true;
    component.produtoForm.patchValue(mockProduto);
    mockApiService.updateProduto.and.returnValue(throwError(() => new Error('API Error')));

    component.onSubmit();

    expect(component.errorMessage).toBe('Erro ao atualizar o produto.');
    expect(component.isLoading).toBe(false);
  });

  it('should validate required fields', () => {
    const nomeControl = component.produtoForm.get('nome');
    const valorControl = component.produtoForm.get('valor');
    const caminhoImagemControl = component.produtoForm.get('caminho_imagem');

    // Limpa os valores para forçar a validação required
    nomeControl?.setValue('');
    nomeControl?.markAsTouched();
    valorControl?.setValue(null);
    valorControl?.markAsTouched();
    caminhoImagemControl?.setValue('');
    caminhoImagemControl?.markAsTouched();

    expect(nomeControl?.hasError('required')).toBe(true);
    expect(valorControl?.hasError('required')).toBe(true);
    expect(caminhoImagemControl?.hasError('required')).toBe(true);
  });

  it('should validate minimum value for valor field', () => {
    const valorControl = component.produtoForm.get('valor');

    valorControl?.setValue(0);
    expect(valorControl?.hasError('min')).toBe(true);

    valorControl?.setValue(0.01);
    expect(valorControl?.hasError('min')).toBe(false);
  });
});
