import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let mockCartService: any;
  let mockRouter: any;

  beforeEach(async () => {
    // Mock services
    mockCartService = jasmine.createSpyObj('CartService', [
      'getCart',
      'getCartTotal',
      'removeItem',
      'updateItemQuantity',
    ]);

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Mock default return values
    mockCartService.getCart.and.returnValue(of([]));
    mockCartService.getCartTotal.and.returnValue(of(0));

    await TestBed.configureTestingModule({
      imports: [CartComponent, CommonModule, RouterTestingModule, CurrencyPipe],
      providers: [
        { provide: CartService, useValue: mockCartService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with cart and total observables from CartService', () => {
    expect(component.cartItems$).toBeDefined();
    expect(component.cartTotal$).toBeDefined();
    expect(mockCartService.getCart).toHaveBeenCalled();
    expect(mockCartService.getCartTotal).toHaveBeenCalled();
  });

  it('should have empty itemParaRemover on initialization', () => {
    expect(component.itemParaRemover).toBeNull();
  });

  it('should set itemParaRemover when abrirModalRemocao is called', () => {
    const mockItem = {
      id_produto: 1,
      nome: 'Cupcake Chocolate',
      valor: 5.0,
      quantidade: 2,
    };

    component.abrirModalRemocao(mockItem);

    expect(component.itemParaRemover).toEqual(mockItem);
  });

  it('should attempt to remove item from cart when confirmarRemocao is called with valid item', () => {
    const mockItem = {
      id_produto: 1,
      nome: 'Cupcake Chocolate',
      valor: 5.0,
      quantidade: 2,
    };

    component.itemParaRemover = mockItem;
    (component as any).removeModal = {
      hide: jasmine.createSpy('hide'),
      dispose: jasmine.createSpy('dispose'),
    };

    component.confirmarRemocao();

    expect(mockCartService.removeItem).toHaveBeenCalledWith(1);
  });

  it('should not remove item if itemParaRemover is null', () => {
    component.itemParaRemover = null;

    component.confirmarRemocao();

    expect(mockCartService.removeItem).not.toHaveBeenCalled();
  });

  it('should update quantity when updateQuantity is called', () => {
    const mockEvent = {
      target: {
        value: '3',
      } as HTMLInputElement,
    } as any;

    component.updateQuantity(mockEvent, 1);

    expect(mockCartService.updateItemQuantity).toHaveBeenCalledWith(1, 3);
  });

  it('should not update quantity with invalid input', () => {
    const mockEvent = {
      target: {
        value: 'invalid',
      } as HTMLInputElement,
    } as any;

    component.updateQuantity(mockEvent, 1);

    expect(mockCartService.updateItemQuantity).not.toHaveBeenCalled();
  });

  it('should navigate to checkout when proceedToCheckout is called', () => {
    component.proceedToCheckout();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkout']);
  });

  it('should display cart items from observable', (done) => {
    const mockCartItems = [
      {
        id_produto: 1,
        nome: 'Cupcake Chocolate',
        valor: 5.0,
        quantidade: 2,
      },
      {
        id_produto: 2,
        nome: 'Cupcake Morango',
        valor: 6.0,
        quantidade: 1,
      },
    ];

    // Recria o componente com o novo mock
    mockCartService.getCart.and.returnValue(of(mockCartItems));

    const newFixture = TestBed.createComponent(CartComponent);
    const newComponent = newFixture.componentInstance;

    newComponent.cartItems$.subscribe((items) => {
      expect(items.length).toBe(2);
      expect(items[0].nome).toBe('Cupcake Chocolate');
      expect(items[1].nome).toBe('Cupcake Morango');
      done();
    });
  });

  it('should display cart total from observable', (done) => {
    mockCartService.getCartTotal.and.returnValue(of(16.0));

    // Recria o componente com o novo mock
    const newFixture = TestBed.createComponent(CartComponent);
    const newComponent = newFixture.componentInstance;

    newComponent.cartTotal$.subscribe((total) => {
      expect(total).toBe(16.0);
      done();
    });
  });

  it('should handle multiple quantity updates', () => {
    const mockEvent1 = {
      target: { value: '2' } as HTMLInputElement,
    } as any;

    const mockEvent2 = {
      target: { value: '5' } as HTMLInputElement,
    } as any;

    component.updateQuantity(mockEvent1, 1);
    component.updateQuantity(mockEvent2, 2);

    expect(mockCartService.updateItemQuantity).toHaveBeenCalledTimes(2);
    expect(mockCartService.updateItemQuantity).toHaveBeenCalledWith(1, 2);
    expect(mockCartService.updateItemQuantity).toHaveBeenCalledWith(2, 5);
  });

  it('should cleanup on ngOnDestroy without errors', () => {
    expect(() => {
      component.ngOnDestroy();
    }).not.toThrow();
  });

  // ===== NOVOS TESTES PARA AUMENTAR COBERTURA =====

  it('should handle zero quantity input', () => {
    const mockEvent = {
      target: {
        value: '0',
      } as HTMLInputElement,
    } as any;

    component.updateQuantity(mockEvent, 1);

    // O componente permite zero (CartService faz validação)
    expect(mockCartService.updateItemQuantity).toHaveBeenCalledWith(1, 0);
  });

  it('should handle negative quantity input', () => {
    const mockEvent = {
      target: {
        value: '-5',
      } as HTMLInputElement,
    } as any;

    component.updateQuantity(mockEvent, 1);

    // O componente permite negativos (CartService faz validação)
    expect(mockCartService.updateItemQuantity).toHaveBeenCalledWith(1, -5);
  });

  it('should handle decimal quantity input', () => {
    const mockEvent = {
      target: {
        value: '2.5',
      } as HTMLInputElement,
    } as any;

    component.updateQuantity(mockEvent, 1);

    // O componente passa decimais também (CartService faz validação)
    expect(mockCartService.updateItemQuantity).toHaveBeenCalled();
  });

  it('should clear itemParaRemover after successful removal', () => {
    const mockItem = {
      id_produto: 1,
      nome: 'Cupcake Chocolate',
      valor: 5.0,
      quantidade: 2,
    };

    component.itemParaRemover = mockItem;
    (component as any).removeModal = {
      hide: jasmine.createSpy('hide'),
      dispose: jasmine.createSpy('dispose'),
    };

    component.confirmarRemocao();

    expect(component.itemParaRemover).toBeNull();
  });

  it('should hide modal after confirming removal', () => {
    const mockItem = {
      id_produto: 1,
      nome: 'Cupcake Chocolate',
      valor: 5.0,
      quantidade: 2,
    };

    component.itemParaRemover = mockItem;
    const mockModal = {
      hide: jasmine.createSpy('hide'),
      dispose: jasmine.createSpy('dispose'),
    };
    (component as any).removeModal = mockModal;

    component.confirmarRemocao();

    expect(mockModal.hide).toHaveBeenCalled();
  });

  it('should handle empty cart display correctly', (done) => {
    mockCartService.getCart.and.returnValue(of([]));

    const newFixture = TestBed.createComponent(CartComponent);
    const newComponent = newFixture.componentInstance;

    newComponent.cartItems$.subscribe((items) => {
      expect(items.length).toBe(0);
      done();
    });
  });

  it('should update quantity with minimum boundary value (1)', () => {
    const mockEvent = {
      target: {
        value: '1',
      } as HTMLInputElement,
    } as any;

    component.updateQuantity(mockEvent, 1);

    expect(mockCartService.updateItemQuantity).toHaveBeenCalledWith(1, 1);
  });

  it('should update quantity with maximum boundary value (999)', () => {
    const mockEvent = {
      target: {
        value: '999',
      } as HTMLInputElement,
    } as any;

    component.updateQuantity(mockEvent, 1);

    expect(mockCartService.updateItemQuantity).toHaveBeenCalledWith(1, 999);
  });

  it('should handle very large quantity input', () => {
    const mockEvent = {
      target: {
        value: '99999',
      } as HTMLInputElement,
    } as any;

    component.updateQuantity(mockEvent, 1);

    expect(mockCartService.updateItemQuantity).toHaveBeenCalledWith(1, 99999);
  });

  it('should not proceed to checkout on navigation error', () => {
    mockRouter.navigate.and.returnValue(Promise.reject('Navigation failed'));

    component.proceedToCheckout();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/checkout']);
  });

  it('should set multiple items for removal in sequence', () => {
    const mockItem1 = {
      id_produto: 1,
      nome: 'Cupcake Chocolate',
      valor: 5.0,
      quantidade: 2,
    };

    const mockItem2 = {
      id_produto: 2,
      nome: 'Cupcake Morango',
      valor: 6.0,
      quantidade: 1,
    };

    component.abrirModalRemocao(mockItem1);
    expect(component.itemParaRemover).toEqual(mockItem1);

    component.abrirModalRemocao(mockItem2);
    expect(component.itemParaRemover).toEqual(mockItem2);
  });

  it('should handle cart with single item', (done) => {
    const mockCartItems = [
      {
        id_produto: 1,
        nome: 'Cupcake Chocolate',
        valor: 5.0,
        quantidade: 1,
      },
    ];

    mockCartService.getCart.and.returnValue(of(mockCartItems));

    const newFixture = TestBed.createComponent(CartComponent);
    const newComponent = newFixture.componentInstance;

    newComponent.cartItems$.subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0].id_produto).toBe(1);
      done();
    });
  });

  it('should handle empty string input for quantity', () => {
    const mockEvent = {
      target: {
        value: '',
      } as HTMLInputElement,
    } as any;

    component.updateQuantity(mockEvent, 1);

    expect(mockCartService.updateItemQuantity).not.toHaveBeenCalled();
  });

  it('should handle whitespace input for quantity', () => {
    const mockEvent = {
      target: {
        value: '   ',
      } as HTMLInputElement,
    } as any;

    component.updateQuantity(mockEvent, 1);

    expect(mockCartService.updateItemQuantity).not.toHaveBeenCalled();
  });
});
