import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necessário para *ngIf e async pipe
import { CartService } from '../../services/cart.service'; // Importe o CartService

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayoutComponent implements OnInit {
  cartItemCount: number = 0;

  constructor(private cartService: CartService) {} // Injete o CartService

  ngOnInit(): void {
    this.cartService.getCartItemCount().subscribe((count) => {
      this.cartItemCount = count;
    });
  }
}
