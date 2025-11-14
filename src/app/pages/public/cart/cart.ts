import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { Observable } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems$: Observable<any[]>;
  cartTotal$: Observable<number>;

  itemParaRemover: any | null = null;
  private removeModal: any;

  constructor(private cartService: CartService, private router: Router) {
    this.cartItems$ = this.cartService.getCart();
    this.cartTotal$ = this.cartService.getCartTotal();
  }

  ngOnInit(): void {
    setTimeout(() => {
      const modalElement = document.getElementById('confirmRemoveItemModal');
      if (modalElement) {
        this.removeModal = new bootstrap.Modal(modalElement);
      }
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.removeModal) {
      this.removeModal.dispose();
    }
  }

  public abrirModalRemocao(item: any): void {
    this.itemParaRemover = item;
    if (this.removeModal) {
      this.removeModal.show();
    }
  }

  public confirmarRemocao(): void {
    if (this.itemParaRemover && this.removeModal) {
      this.cartService.removeItem(this.itemParaRemover.id_produto);
      this.removeModal.hide();
      this.itemParaRemover = null;
    }
  }

  public updateQuantity(event: Event, id_produto: number): void {
    const target = event.target as HTMLInputElement;
    const quantidade = parseInt(target.value, 10);
    if (!isNaN(quantidade)) {
      this.cartService.updateItemQuantity(id_produto, quantidade);
    }
  }

  public proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
