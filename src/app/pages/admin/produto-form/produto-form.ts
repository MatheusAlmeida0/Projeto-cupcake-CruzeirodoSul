import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';

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
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {
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
    this.produtoId = this.route.snapshot.paramMap.get('id');

    if (this.produtoId) {
      this.isEditMode = true;
      this.isLoading = true;

      this.apiService.getProdutoById(this.produtoId).subscribe({
        next: (data) => {
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
  }

  public onSubmit(): void {
    if (this.produtoForm.invalid) {
      this.notificationService.showSuccess(`Por favor, preencha todos os campos obrigatórios.`);
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    const produtoData = this.produtoForm.value;

    if (this.isEditMode && this.produtoId) {
      this.apiService.updateProduto(this.produtoId, produtoData).subscribe({
        next: () => {
          this.notificationService.showSuccess(`Produto atualizado com sucesso!`);
          this.router.navigate(['/admin/produtos']);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Erro ao atualizar o produto.';
          this.isLoading = false;
        },
      });
    } else {
      this.apiService.createProduto(produtoData).subscribe({
        next: () => {
          this.notificationService.showSuccess(`Produto criado com sucesso!`);
          this.router.navigate(['/admin/produtos']);
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
