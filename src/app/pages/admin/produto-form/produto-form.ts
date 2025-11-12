import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produto-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.scss',
  standalone: true,
})
export class ProdutoFormComponent implements OnInit {
  public produtoForm: FormGroup;
  public produtoId: string | null = null;
  public isEditMode: boolean = false;
  public isLoading: boolean = false;
  public errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute, // Para ler o ID da URL
    private router: Router // Para navegar após salvar
  ) {
    // 2. Crie a estrutura do formulário
    this.produtoForm = this.fb.group({
      nome: ['', Validators.required],
      peso: [0, Validators.required],
      ingredientes: ['', Validators.required],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      contem_gluten: [false],
      contem_lactose: [false],
      contem_leite: [false],
      contem_amendoim: [false],
      caminho_imagem: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // 3. Verifique se há um ID na rota (modo de edição)
    this.produtoId = this.route.snapshot.paramMap.get('id');

    if (this.produtoId) {
      this.isEditMode = true;
      this.isLoading = true;
      // 4. Se for edição, busque o produto na API
      this.apiService.getProdutoById(this.produtoId).subscribe({
        next: (data) => {
          // 5. Preencha o formulário com os dados
          this.produtoForm.patchValue(data);
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Erro ao carregar o produto.';
          this.isLoading = false;
        },
      });
    }
    // Se não houver ID, é o modo "novo" e o formulário fica em branco.
  }

  // 6. Função chamada ao enviar o formulário
  public onSubmit(): void {
    if (this.produtoForm.invalid) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const produtoData = this.produtoForm.value;

    if (this.isEditMode && this.produtoId) {
      // --- MODO EDIÇÃO ---
      this.apiService.updateProduto(this.produtoId, produtoData).subscribe({
        next: () => {
          alert('Produto atualizado com sucesso!');
          this.router.navigate(['/admin/produtos']); // Volta para a lista
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Erro ao atualizar o produto.';
          this.isLoading = false;
        },
      });
    } else {
      // --- MODO CRIAÇÃO ---
      this.apiService.createProduto(produtoData).subscribe({
        next: () => {
          alert('Produto criado com sucesso!');
          this.router.navigate(['/admin/produtos']); // Volta para a lista
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Erro ao criar o produto.';
          this.isLoading = false;
        },
      });
    }
  }
}
