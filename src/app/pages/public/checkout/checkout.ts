import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class CheckoutComponent implements OnInit {
  cartItems$: Observable<any[]>;
  cartTotal$: Observable<number>;
  orderId: string = '';
  whatsappLink: string = '';

  constructor(
    private cartService: CartService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.cartItems$ = this.cartService.getCart();
    this.cartTotal$ = this.cartService.getCartTotal();
  }

  ngOnInit(): void {
    this.orderId = 'PED-' + Math.floor(Math.random() * 1000000);
    this.generateWhatsAppLink();
  }

  private generateWhatsAppLink(): void {
    const numeroTelefone = '5518996456473';
    let message = `Olá! Meu pedido #${this.orderId} é o seguinte:\n\n`;

    const currencyFormatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    this.cartItems$
      .pipe(
        map((items) => {
          items.forEach((item) => {
            // Usar o formatador de moeda para o subtotal
            const subtotalFormatado = currencyFormatter.format(item.valor * item.quantidade);
            message += `- ${item.quantidade}x ${item.nome} (${subtotalFormatado})\n`;
          });
          return message;
        })
      )
      .subscribe((finalMessage) => {
        this.cartTotal$.subscribe((total) => {
          const totalFormatado = currencyFormatter.format(total);
          finalMessage += `\nTotal: ${totalFormatado}`;
          this.whatsappLink = `https://api.whatsapp.com/send?phone=${numeroTelefone}&text=${encodeURIComponent(
            finalMessage
          )}`;
        });
      });
  }

  public finalizeOrder(): void {
    this.cartService.clearCart();

    this.notificationService.showSuccess('Pedido enviado para o WhatsApp! Entraremos em contato.');
    this.router.navigate(['/']);
  }
}
