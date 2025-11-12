import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api';

@Component({
  selector: 'app-produto-detalhe',
  standalone: true,
  // 1. Importe CommonModule e RouterModule
  imports: [CommonModule, RouterModule],
  templateUrl: './produto-detalhe.html',
  styleUrl: './produto-detalhe.scss',
})
export class ProdutoDetalheComponent implements OnInit {
  public produto: any = null; // Guarda o produto único
  public carregando: boolean = true;
  public produtoNaoEncontrado: boolean = false;

  // 2. Injete ActivatedRoute e ApiService
  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    // 3. Pega o 'id' da URL
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // 4. Chama o serviço para buscar o produto
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
      // Caso não tenha ID na URL
      this.carregando = false;
      this.produtoNaoEncontrado = true;
    }
  }

  /**
   * Gera o link do WhatsApp com a mensagem
   */
  public getWhatsAppLink(): string {
    if (!this.produto) return '';

    // (Ajuste o número de telefone e a mensagem)
    const numeroTelefone = '5511999998888';
    const texto = `Olá! Gostaria de fazer um pedido do cupcake: ${this.produto.nome}`;

    // Codifica o texto para ser usado em uma URL
    const mensagemFormatada = encodeURIComponent(texto);

    return `https://api.whatsapp.com/send?phone=${numeroTelefone}&text=${mensagemFormatada}`;
  }
}
