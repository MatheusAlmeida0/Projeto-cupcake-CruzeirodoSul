import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicLayoutComponent } from './public-layout';
import { CartService } from '../../services/cart.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PublicLayoutComponent', () => {
  let component: PublicLayoutComponent;
  let fixture: ComponentFixture<PublicLayoutComponent>;
  let mockCartService: any;
  let cartCountSubject: BehaviorSubject<number>;

  beforeEach(async () => {
    cartCountSubject = new BehaviorSubject<number>(0);

    mockCartService = {
      getCartItemCount: () => cartCountSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [PublicLayoutComponent, CommonModule, RouterTestingModule],
      providers: [{ provide: CartService, useValue: mockCartService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize cartItemCount with 0 by default', () => {
    fixture.detectChanges();
    expect(component.cartItemCount).toBe(0);
  });

  it('should update cartItemCount when cart service emits a new count', () => {
    fixture.detectChanges();
    cartCountSubject.next(5);
    fixture.detectChanges();
    expect(component.cartItemCount).toBe(5);
  });

  it('should update cartItemCount with 0 when cart service emits 0', () => {
    fixture.detectChanges();
    cartCountSubject.next(0);
    fixture.detectChanges();
    expect(component.cartItemCount).toBe(0);
  });

  it('should display the cart item count in the template (if applicable)', () => {
    fixture.detectChanges();
    cartCountSubject.next(3);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cartCountElement = compiled.querySelector('#cart-count');
    if (cartCountElement) {
      expect(cartCountElement.textContent).toContain('3');
    }
  });
});
