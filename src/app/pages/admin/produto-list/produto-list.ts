import { Component, OnInit, OnDestroy } from '@angular/core'; // Adicione OnDestroy
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api'; // Certifique-se do caminho correto
import { NotificationService } from '../../../services/notification.service'; // Certifique-se do caminho correto

// Declare 'bootstrap' se você for interagir com o JS do Bootstrap diretamente
declare var bootstrap: any; // Importante para usar o JS do Bootstrap

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './produto-list.html',
  styleUrl: './produto-list.scss',
})
export class ProdutoListComponent implements OnInit, OnDestroy {
  // Implemente OnDestroy
  public listaProdutos: any[] = [];
  public carregando: boolean = true;

  // Variáveis para o modal de exclusão
  public produtoParaExcluir: any | null = null; // Armazena o produto selecionado para exclusão
  private deleteModal: any; // Referência ao objeto modal do Bootstrap

  constructor(private apiService: ApiService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.carregarProdutos();

    // Inicializa o modal Bootstrap APÓS a view ser renderizada
    // O setTimeout é uma gambiarra para garantir que o elemento HTML do modal esteja disponível.
    // Em projetos maiores, use ViewChild ou ngAfterViewInit para referenciar elementos da view.
    setTimeout(() => {
      const modalElement = document.getElementById('confirmDeleteModal');
      if (modalElement) {
        this.deleteModal = new bootstrap.Modal(modalElement);
      }
    }, 0);
  }

  ngOnDestroy(): void {
    // Garante que o modal seja limpo quando o componente for destruído
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

  // Abre o modal de confirmação de exclusão
  public abrirModalExclusao(produto: any): void {
    this.produtoParaExcluir = produto; // Salva o produto para usar no modal
    if (this.deleteModal) {
      this.deleteModal.show(); // Exibe o modal
    }
  }

  // Lógica para confirmar a exclusão (chamada pelo botão "Excluir" do modal)
  public confirmarExclusao(): void {
    if (this.produtoParaExcluir && this.deleteModal) {
      const id = this.produtoParaExcluir.id_produto;
      const nomeProduto = this.produtoParaExcluir.nome;

      this.apiService.deleteProduto(id).subscribe({
        next: () => {
          this.notificationService.showSuccess(`Produto "${nomeProduto}" excluído com sucesso!`);
          this.carregarProdutos(); // Recarrega a lista
          this.deleteModal.hide(); // Fecha o modal após a exclusão
          this.produtoParaExcluir = null; // Limpa o produto selecionado
        },
        error: (err) => {
          console.error(`Erro ao excluir produto "${nomeProduto}":`, err);
          this.notificationService.showError(`Erro ao excluir produto "${nomeProduto}".`);
          this.deleteModal.hide(); // Fecha o modal mesmo em caso de erro
          this.produtoParaExcluir = null;
        },
      });
    }
  }
}
