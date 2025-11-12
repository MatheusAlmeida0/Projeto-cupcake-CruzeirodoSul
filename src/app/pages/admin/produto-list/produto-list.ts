import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [CommonModule, RouterModule], // Precisamos disso para *ngFor e routerLink
  templateUrl: './produto-list.html',
  styleUrl: './produto-list.scss',
})
export class ProdutoListComponent implements OnInit {
  public listaProdutos: any[] = [];
  public carregando: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  public carregarProdutos(): void {
    this.carregando = true;
    this.apiService.getProdutos().subscribe({
      next: (data) => {
        this.listaProdutos = data;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        alert('Erro ao carregar produtos. Tente novamente.');
        this.carregando = false;
      },
    });
  }

  public excluirProduto(id: string | number): void {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    this.apiService.deleteProduto(id).subscribe({
      next: () => {
        alert('Produto excluído com sucesso!');
        // Atualiza a lista removendo o produto excluído (ou recarrega tudo)
        this.carregarProdutos();
      },
      error: (err) => {
        console.error('Erro ao excluir produto:', err);
        alert('Erro ao excluir produto.');
      },
    });
  }
}
