import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProdutoListComponent } from './produto-list';
import { ApiService } from '../../../services/api';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('ProdutoListComponent', () => {
  let component: ProdutoListComponent;
  let fixture: ComponentFixture<ProdutoListComponent>;
  let mockApiService: any;
  let mockNotificationService: any;

  beforeEach(async () => {
    // Mock services
    mockApiService = jasmine.createSpyObj('ApiService', ['getProdutos', 'deleteProduto']);

    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
    ]);

    await TestBed.configureTestingModule({
      imports: [ProdutoListComponent, CommonModule, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty listaProdutos and carregando as true', () => {
    expect(component.listaProdutos).toEqual([]);
    expect(component.carregando).toBe(true);
  });

  it('should load produtos on ngOnInit', () => {
    const mockProdutos = [
      {
        id_produto: 1,
        nome: 'Cupcake Chocolate',
        valor: 5.0,
        caminho_imagem: '/images/cupcake1.png',
      },
      {
        id_produto: 2,
        nome: 'Cupcake Morango',
        valor: 6.0,
        caminho_imagem: '/images/cupcake2.png',
      },
    ];

    mockApiService.getProdutos.and.returnValue(of(mockProdutos));

    component.ngOnInit();

    expect(mockApiService.getProdutos).toHaveBeenCalled();
    expect(component.listaProdutos).toEqual(mockProdutos);
    expect(component.carregando).toBe(false);
  });

  it('should handle error when loading produtos fails', () => {
    mockApiService.getProdutos.and.returnValue(throwError(() => new Error('API Error')));

    component.carregarProdutos();

    expect(mockNotificationService.showError).toHaveBeenCalledWith(
      'Erro ao carregar produtos. Tente novamente.'
    );
    expect(component.carregando).toBe(false);
  });

  it('should call carregarProdutos method', () => {
    const mockProdutos = [
      {
        id_produto: 1,
        nome: 'Cupcake Chocolate',
        valor: 5.0,
        caminho_imagem: '/images/cupcake1.png',
      },
    ];

    mockApiService.getProdutos.and.returnValue(of(mockProdutos));

    component.carregarProdutos();

    expect(component.listaProdutos).toEqual(mockProdutos);
    expect(component.carregando).toBe(false);
  });

  it('should set produtoParaExcluir when abrirModalExclusao is called', () => {
    const mockProduto = {
      id_produto: 1,
      nome: 'Cupcake Chocolate',
      valor: 5.0,
    };

    component.abrirModalExclusao(mockProduto);

    expect(component.produtoParaExcluir).toEqual(mockProduto);
  });

  it('should attempt to delete produto when confirmarExclusao is called with valid produto', () => {
    const mockProduto = {
      id_produto: 1,
      nome: 'Cupcake Chocolate',
      valor: 5.0,
    };

    const mockProdutos = [
      {
        id_produto: 2,
        nome: 'Cupcake Morango',
        valor: 6.0,
      },
    ];

    component.produtoParaExcluir = mockProduto;
    // Mocka o deleteModal para que a lógica seja executada
    (component as any).deleteModal = {
      hide: jasmine.createSpy('hide'),
      dispose: jasmine.createSpy('dispose'),
    };

    mockApiService.deleteProduto.and.returnValue(of({}));
    mockApiService.getProdutos.and.returnValue(of(mockProdutos));

    component.confirmarExclusao();

    expect(mockApiService.deleteProduto).toHaveBeenCalledWith(1);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
      'Produto "Cupcake Chocolate" excluído com sucesso!'
    );
  });

  it('should handle error when deleting produto fails', () => {
    const mockProduto = {
      id_produto: 1,
      nome: 'Cupcake Chocolate',
      valor: 5.0,
    };

    component.produtoParaExcluir = mockProduto;
    // Mocka o deleteModal para que a lógica seja executada
    (component as any).deleteModal = {
      hide: jasmine.createSpy('hide'),
      dispose: jasmine.createSpy('dispose'),
    };

    mockApiService.deleteProduto.and.returnValue(throwError(() => new Error('API Error')));

    component.confirmarExclusao();

    expect(mockApiService.deleteProduto).toHaveBeenCalledWith(1);
    expect(mockNotificationService.showError).toHaveBeenCalledWith(
      'Erro ao excluir produto "Cupcake Chocolate".'
    );
  });

  it('should not delete produto if produtoParaExcluir is null', () => {
    component.produtoParaExcluir = null;

    component.confirmarExclusao();

    expect(mockApiService.deleteProduto).not.toHaveBeenCalled();
  });

  it('should cleanup on ngOnDestroy without errors', () => {
    expect(() => {
      component.ngOnDestroy();
    }).not.toThrow();
  });

  it('should display list of produtos after loading', () => {
    const mockProdutos = [
      {
        id_produto: 1,
        nome: 'Cupcake Chocolate',
        valor: 5.0,
        caminho_imagem: '/images/cupcake1.png',
      },
      {
        id_produto: 2,
        nome: 'Cupcake Morango',
        valor: 6.0,
        caminho_imagem: '/images/cupcake2.png',
      },
    ];

    mockApiService.getProdutos.and.returnValue(of(mockProdutos));

    fixture.detectChanges();
    component.carregarProdutos();
    fixture.detectChanges();

    expect(component.listaProdutos.length).toBe(2);
    expect(component.listaProdutos[0].nome).toBe('Cupcake Chocolate');
    expect(component.listaProdutos[1].nome).toBe('Cupcake Morango');
  });
});
