import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardapioComponent } from './cardapio';
import { ApiService } from '../../../services/api';
import { CartService } from '../../../services/cart.service';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('CardapioComponent', () => {
  let component: CardapioComponent;
  let fixture: ComponentFixture<CardapioComponent>;
  let mockApiService: any;
  let mockCartService: any;
  let mockNotificationService: any;

  beforeEach(async () => {
    // Mock services
    mockApiService = jasmine.createSpyObj('ApiService', ['getProdutos']);
    mockCartService = jasmine.createSpyObj('CartService', ['addToCart']);
    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
    ]);

    await TestBed.configureTestingModule({
      imports: [CardapioComponent, CommonModule, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: CartService, useValue: mockCartService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CardapioComponent);
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

    component.ngOnInit();

    expect(component.carregando).toBe(false);
  });

  it('should add product to cart when addToCart is called', () => {
    const mockProduto = {
      id_produto: 1,
      nome: 'Cupcake Chocolate',
      valor: 5.0,
      caminho_imagem: '/images/cupcake1.png',
    };

    component.addToCart(mockProduto);

    expect(mockCartService.addToCart).toHaveBeenCalledWith(mockProduto);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
      'Produto adicionado ao carrinho!.'
    );
  });

  it('should display empty list when no produtos are available', () => {
    mockApiService.getProdutos.and.returnValue(of([]));

    component.ngOnInit();

    expect(component.listaProdutos).toEqual([]);
    expect(component.carregando).toBe(false);
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
      {
        id_produto: 3,
        nome: 'Cupcake Baunilha',
        valor: 4.5,
        caminho_imagem: '/images/cupcake3.png',
      },
    ];

    mockApiService.getProdutos.and.returnValue(of(mockProdutos));

    fixture.detectChanges();
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.listaProdutos.length).toBe(3);
    expect(component.listaProdutos[0].nome).toBe('Cupcake Chocolate');
    expect(component.listaProdutos[1].nome).toBe('Cupcake Morango');
    expect(component.listaProdutos[2].nome).toBe('Cupcake Baunilha');
  });

  it('should call addToCart for multiple products', () => {
    const mockProduto1 = {
      id_produto: 1,
      nome: 'Cupcake Chocolate',
      valor: 5.0,
    };

    const mockProduto2 = {
      id_produto: 2,
      nome: 'Cupcake Morango',
      valor: 6.0,
    };

    component.addToCart(mockProduto1);
    component.addToCart(mockProduto2);

    expect(mockCartService.addToCart).toHaveBeenCalledTimes(2);
    expect(mockCartService.addToCart).toHaveBeenCalledWith(mockProduto1);
    expect(mockCartService.addToCart).toHaveBeenCalledWith(mockProduto2);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledTimes(2);
  });

  it('should set carregando to false after produtos are loaded', () => {
    const mockProdutos = [
      {
        id_produto: 1,
        nome: 'Cupcake Chocolate',
        valor: 5.0,
        caminho_imagem: '/images/cupcake1.png',
      },
    ];

    mockApiService.getProdutos.and.returnValue(of(mockProdutos));

    expect(component.carregando).toBe(true);

    component.ngOnInit();

    expect(component.carregando).toBe(false);
  });

  it('should set carregando to false even when error occurs', () => {
    mockApiService.getProdutos.and.returnValue(throwError(() => new Error('API Error')));

    expect(component.carregando).toBe(true);

    component.ngOnInit();

    expect(component.carregando).toBe(false);
  });
});
