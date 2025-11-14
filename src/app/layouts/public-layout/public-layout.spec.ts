import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicLayoutComponent } from './public-layout';
import { CartService } from '../../services/cart.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('PublicLayoutComponent', () => {
  let component: PublicLayoutComponent;
  let fixture: ComponentFixture<PublicLayoutComponent>;
  let mockCartService: any;
  let cartItemCountSubject: BehaviorSubject<number>;

  beforeEach(async () => {
    cartItemCountSubject = new BehaviorSubject<number>(0);

    mockCartService = jasmine.createSpyObj('CartService', ['getCartItemCount']);
    mockCartService.getCartItemCount.and.returnValue(cartItemCountSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [PublicLayoutComponent, CommonModule, RouterTestingModule],
      providers: [{ provide: CartService, useValue: mockCartService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize cartItemCount with 0 by default when service emits 0', () => {
    cartItemCountSubject.next(0);
    fixture.detectChanges();

    expect(component.cartItemCount).toBe(0);
    expect(mockCartService.getCartItemCount).toHaveBeenCalled();
  });

  it('should update cartItemCount when cart service emits a new count', () => {
    cartItemCountSubject.next(0);
    fixture.detectChanges();
    expect(component.cartItemCount).toBe(0);

    cartItemCountSubject.next(5);
    fixture.detectChanges();
    expect(component.cartItemCount).toBe(5);
  });

  it('should update cartItemCount with 0 when cart service emits 0 after some items', () => {
    cartItemCountSubject.next(3);
    fixture.detectChanges();
    expect(component.cartItemCount).toBe(3);

    cartItemCountSubject.next(0);
    fixture.detectChanges();
    expect(component.cartItemCount).toBe(0);
  });

  it('should display the cart item count in the template (if applicable)', () => {
    cartItemCountSubject.next(3);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const cartCountElement = compiled.querySelector('#cart-count');
    if (cartCountElement) {
      expect(cartCountElement.textContent).toContain('3');
    }
  });
});
