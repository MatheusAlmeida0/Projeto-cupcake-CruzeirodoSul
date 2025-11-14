import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProdutoDetalheComponent } from './produto-detalhe';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api';
import { CartService } from '../../../services/cart.service';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';

describe('ProdutoDetalheComponent', () => {
  let component: ProdutoDetalheComponent;
  let fixture: ComponentFixture<ProdutoDetalheComponent>;
  let mockApiService: any;
  let mockCartService: any;
  let mockNotificationService: any;
  let mockActivatedRoute: any;

  const mockProduto = {
    id: 1,
    nome: 'Cupcake Chocolate',
    descricao: 'Delicioso cupcake de chocolate',
    valor: 15.0,
    imagem: 'cupcake-chocolate.jpg',
  };

  beforeEach(async () => {
    // Mock services
    mockApiService = jasmine.createSpyObj('ApiService', ['getProdutoById']);
    mockCartService = jasmine.createSpyObj('CartService', ['addToCart']);
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['showSuccess']);

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue('1'),
        },
      },
    };

    // Mock default return values
    mockApiService.getProdutoById.and.returnValue(of(mockProduto));

    await TestBed.configureTestingModule({
      imports: [ProdutoDetalheComponent, CommonModule],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: CartService, useValue: mockCartService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdutoDetalheComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state true', () => {
    expect(component.carregando).toBe(true);
    expect(component.produto).toBeNull();
    expect(component.produtoNaoEncontrado).toBe(false);
  });

  it('should load product by id on ngOnInit', () => {
    fixture.detectChanges();

    expect(mockActivatedRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    expect(mockApiService.getProdutoById).toHaveBeenCalledWith('1');
  });

  it('should set produto and carregando to false after successful load', () => {
    fixture.detectChanges();

    expect(component.produto).toEqual(mockProduto);
    expect(component.carregando).toBe(false);
    expect(component.produtoNaoEncontrado).toBe(false);
  });

  it('should handle error when loading product', () => {
    mockApiService.getProdutoById.and.returnValue(throwError(() => new Error('API Error')));

    fixture.detectChanges();

    expect(component.carregando).toBe(false);
    expect(component.produtoNaoEncontrado).toBe(true);
    expect(component.produto).toBeNull();
  });

  it('should set produtoNaoEncontrado to true when id is not provided', () => {
    mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);

    fixture.detectChanges();

    expect(component.carregando).toBe(false);
    expect(component.produtoNaoEncontrado).toBe(true);
    expect(mockApiService.getProdutoById).not.toHaveBeenCalled();
  });

  it('should generate WhatsApp link with product name', () => {
    component.produto = mockProduto;

    const whatsappLink = component.getWhatsAppLink();

    expect(whatsappLink).toContain('https://api.whatsapp.com/send?phone=5511999998888');
    expect(whatsappLink).toContain(
      encodeURIComponent(`Olá! Gostaria de fazer um pedido do cupcake: ${mockProduto.nome}`)
    );
  });

  it('should return empty string when produto is null in getWhatsAppLink', () => {
    component.produto = null;

    const whatsappLink = component.getWhatsAppLink();

    expect(whatsappLink).toBe('');
  });

  it('should encode special characters in WhatsApp message', () => {
    const produtoComCaracteres = {
      ...mockProduto,
      nome: 'Cupcake com Açúcar & Especiarias',
    };
    component.produto = produtoComCaracteres;

    const whatsappLink = component.getWhatsAppLink();

    expect(whatsappLink).toContain(encodeURIComponent('Açúcar'));
    expect(whatsappLink).toContain(encodeURIComponent('&'));
  });

  it('should add product to cart when addToCart is called', () => {
    const mockProdutoToAdd = {
      id_produto: 1,
      nome: 'Cupcake Chocolate',
      valor: 15.0,
    };

    component.addToCart(mockProdutoToAdd);

    expect(mockCartService.addToCart).toHaveBeenCalledWith(mockProdutoToAdd);
  });

  it('should show success notification when product is added to cart', () => {
    const mockProdutoToAdd = {
      id_produto: 1,
      nome: 'Cupcake Chocolate',
      valor: 15.0,
    };

    component.addToCart(mockProdutoToAdd);

    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
      'Cupcake Chocolate adicionado ao carrinho!'
    );
  });

  it('should call both CartService and NotificationService when adding to cart', () => {
    const mockProdutoToAdd = {
      id_produto: 2,
      nome: 'Cupcake Morango',
      valor: 12.0,
    };

    component.addToCart(mockProdutoToAdd);

    expect(mockCartService.addToCart).toHaveBeenCalledTimes(1);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledTimes(1);
  });

  it('should load different products based on different ids', () => {
    const newMockProduto = {
      id: 2,
      nome: 'Cupcake Morango',
      descricao: 'Delicioso cupcake de morango',
      valor: 12.0,
      imagem: 'cupcake-morango.jpg',
    };

    mockActivatedRoute.snapshot.paramMap.get.and.returnValue('2');
    mockApiService.getProdutoById.and.returnValue(of(newMockProduto));

    const newFixture = TestBed.createComponent(ProdutoDetalheComponent);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();

    expect(mockApiService.getProdutoById).toHaveBeenCalledWith('2');
    expect(newComponent.produto).toEqual(newMockProduto);
  });
});
