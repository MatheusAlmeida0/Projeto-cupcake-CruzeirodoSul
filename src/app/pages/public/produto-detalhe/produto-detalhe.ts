import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { ApiService } from '../../../services/api';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-produto-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './produto-detalhe.html',
  styleUrl: './produto-detalhe.scss',
})
export class ProdutoDetalheComponent implements OnInit {
  public produto: any = null;
  public carregando: boolean = true;
  public produtoNaoEncontrado: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.apiService.getProdutoById(id).subscribe({
        next: (data) => {
          this.produto = data;
          this.carregando = false;
        },
        error: (err) => {
          console.error('Erro ao buscar produto:', err);
          this.carregando = false;
          this.produtoNaoEncontrado = true;
        },
      });
    } else {
      this.carregando = false;
      this.produtoNaoEncontrado = true;
    }
  }

  public getWhatsAppLink(): string {
    if (!this.produto) return '';
    const numeroTelefone = '5511999998888';
    const texto = `Olá! Gostaria de fazer um pedido do cupcake: ${this.produto.nome}`;
    const mensagemFormatada = encodeURIComponent(texto);
    return `https://api.whatsapp.com/send?phone=${numeroTelefone}&text=${mensagemFormatada}`;
  }

  public addToCart(produto: any): void {
    this.cartService.addToCart(produto);
    this.notificationService.showSuccess(`${produto.nome} adicionado ao carrinho!`);
  }
}
