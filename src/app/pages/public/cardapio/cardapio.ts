import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service'; // Importe o CartService
import { ApiService } from '../../../services/api';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-cardapio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cardapio.html',
  styleUrl: './cardapio.scss',
})
export class CardapioComponent implements OnInit {
  public listaProdutos: any[] = [];
  public carregando: boolean = true;

  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.apiService.getProdutos().subscribe({
      next: (data) => {
        this.listaProdutos = data;
        this.carregando = false;
        console.log('Produtos carregados:', this.listaProdutos);
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.carregando = false;
      },
    });
  }

  public addToCart(produto: any): void {
    this.cartService.addToCart(produto);
    this.notificationService.showSuccess('Produto adicionado ao carrinho!.');
  }
}
