import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  const mockProduto = {
    id_produto: 1,
    nome: 'Cupcake Chocolate',
    valor: 15.0,
    caminho_imagem: 'chocolate.jpg',
  };

  const mockProduto2 = {
    id_produto: 2,
    nome: 'Cupcake Morango',
    valor: 12.0,
    caminho_imagem: 'morango.jpg',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty cart', (done) => {
    service.getCart().subscribe((items) => {
      expect(items.length).toBe(0);
      done();
    });
  });

  it('should add a product to cart', (done) => {
    service.addToCart(mockProduto);

    service.getCart().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0].id_produto).toBe(1);
      expect(items[0].nome).toBe('Cupcake Chocolate');
      expect(items[0].valor).toBe(15.0);
      expect(items[0].quantidade).toBe(1);
      done();
    });
  });

  it('should increment quantity when adding same product twice', (done) => {
    service.addToCart(mockProduto);
    service.addToCart(mockProduto);

    service.getCart().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0].quantidade).toBe(2);
      done();
    });
  });

  it('should add multiple different products to cart', (done) => {
    service.addToCart(mockProduto);
    service.addToCart(mockProduto2);

    service.getCart().subscribe((items) => {
      expect(items.length).toBe(2);
      expect(items[0].id_produto).toBe(1);
      expect(items[1].id_produto).toBe(2);
      done();
    });
  });

  it('should remove item from cart', (done) => {
    service.addToCart(mockProduto);
    service.addToCart(mockProduto2);

    service.removeItem(1);

    service.getCart().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0].id_produto).toBe(2);
      done();
    });
  });

  it('should not affect other items when removing one', (done) => {
    service.addToCart(mockProduto);
    service.addToCart(mockProduto2);
    service.addToCart(mockProduto);

    service.removeItem(2);

    service.getCart().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0].id_produto).toBe(1);
      expect(items[0].quantidade).toBe(2);
      done();
    });
  });

  it('should update item quantity', (done) => {
    service.addToCart(mockProduto);
    service.updateItemQuantity(1, 5);

    service.getCart().subscribe((items) => {
      expect(items[0].quantidade).toBe(5);
      done();
    });
  });

  it('should remove item when quantity is set to 0', (done) => {
    service.addToCart(mockProduto);
    service.addToCart(mockProduto2);

    service.updateItemQuantity(1, 0);

    service.getCart().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0].id_produto).toBe(2);
      done();
    });
  });

  it('should remove item when quantity is set to negative', (done) => {
    service.addToCart(mockProduto);
    service.addToCart(mockProduto2);

    service.updateItemQuantity(1, -5);

    service.getCart().subscribe((items) => {
      expect(items.length).toBe(1);
      expect(items[0].id_produto).toBe(2);
      done();
    });
  });

  it('should clear entire cart', (done) => {
    service.addToCart(mockProduto);
    service.addToCart(mockProduto2);

    service.clearCart();

    service.getCart().subscribe((items) => {
      expect(items.length).toBe(0);
      done();
    });
  });

  it('should calculate correct cart total for single item', (done) => {
    service.addToCart(mockProduto);

    service.getCartTotal().subscribe((total) => {
      expect(total).toBe(15.0);
      done();
    });
  });

  it('should calculate correct cart total for multiple items', (done) => {
    service.addToCart(mockProduto);
    service.addToCart(mockProduto2);

    service.getCartTotal().subscribe((total) => {
      // 15 * 1 + 12 * 1 = 27
      expect(total).toBe(27.0);
      done();
    });
  });

  it('should calculate correct cart total with quantities', (done) => {
    service.addToCart(mockProduto);
    service.addToCart(mockProduto);
    service.addToCart(mockProduto2);

    service.getCartTotal().subscribe((total) => {
      // 15 * 2 + 12 * 1 = 42
      expect(total).toBe(42.0);
      done();
    });
  });

  it('should return 0 as cart total when cart is empty', (done) => {
    service.getCartTotal().subscribe((total) => {
      expect(total).toBe(0);
      done();
    });
  });

  it('should return correct item count', (done) => {
    service.addToCart(mockProduto);
    service.addToCart(mockProduto2);

    service.getCartItemCount().subscribe((count) => {
      expect(count).toBe(2);
      done();
    });
  });

  it('should return 0 as item count when cart is empty', (done) => {
    service.getCartItemCount().subscribe((count) => {
      expect(count).toBe(0);
      done();
    });
  });

  it('should return correct item count after removing item', (done) => {
    service.addToCart(mockProduto);
    service.addToCart(mockProduto2);
    service.removeItem(1);

    service.getCartItemCount().subscribe((count) => {
      expect(count).toBe(1);
      done();
    });
  });

  it('should emit new value to cart observable when adding item', (done) => {
    const items: any[] = [];

    service.getCart().subscribe((cart) => {
      items.push([...cart]);
    });

    service.addToCart(mockProduto);

    setTimeout(() => {
      expect(items.length).toBe(2); // Initial (empty) + after adding
      expect(items[1].length).toBe(1);
      done();
    }, 100);
  });

  it('should emit new value to cart observable when removing item', (done) => {
    service.addToCart(mockProduto);
    service.addToCart(mockProduto2);

    const items: any[] = [];

    service.getCart().subscribe((cart) => {
      items.push([...cart]);
    });

    service.removeItem(1);

    setTimeout(() => {
      expect(items[items.length - 1].length).toBe(1);
      done();
    }, 100);
  });

  it('should calculate total correctly after updating quantity', (done) => {
    service.addToCart(mockProduto);
    service.updateItemQuantity(1, 3);

    service.getCartTotal().subscribe((total) => {
      expect(total).toBe(45.0); // 15 * 3
      done();
    });
  });

  it('should preserve cart properties when adding', (done) => {
    service.addToCart(mockProduto);

    service.getCart().subscribe((items) => {
      expect(items[0].caminho_imagem).toBe('chocolate.jpg');
      expect(items[0].nome).toBe('Cupcake Chocolate');
      done();
    });
  });
});
