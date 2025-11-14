import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api';
import { NotificationService } from '../../../services/notification.service';

declare var bootstrap: any;

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './produto-list.html',
  styleUrl: './produto-list.scss',
})
export class ProdutoListComponent implements OnInit, OnDestroy {
  public listaProdutos: any[] = [];
  public carregando: boolean = true;

  public produtoParaExcluir: any | null = null;
  private deleteModal: any;

  constructor(private apiService: ApiService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.carregarProdutos();

    setTimeout(() => {
      const modalElement = document.getElementById('confirmDeleteModal');
      if (modalElement) {
        this.deleteModal = new bootstrap.Modal(modalElement);
      }
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.deleteModal) {
      this.deleteModal.dispose();
    }
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
        this.notificationService.showError('Erro ao carregar produtos. Tente novamente.');
        this.carregando = false;
      },
    });
  }

  public abrirModalExclusao(produto: any): void {
    this.produtoParaExcluir = produto;
    if (this.deleteModal) {
      this.deleteModal.show();
    }
  }

  public confirmarExclusao(): void {
    if (this.produtoParaExcluir && this.deleteModal) {
      const id = this.produtoParaExcluir.id_produto;
      const nomeProduto = this.produtoParaExcluir.nome;

      this.apiService.deleteProduto(id).subscribe({
        next: () => {
          this.notificationService.showSuccess(`Produto "${nomeProduto}" excluído com sucesso!`);
          this.carregarProdutos();
          this.deleteModal.hide();
          this.produtoParaExcluir = null;
        },
        error: (err) => {
          console.error(`Erro ao excluir produto "${nomeProduto}":`, err);
          this.notificationService.showError(`Erro ao excluir produto "${nomeProduto}".`);
          this.deleteModal.hide();
          this.produtoParaExcluir = null;
        },
      });
    }
  }
}
