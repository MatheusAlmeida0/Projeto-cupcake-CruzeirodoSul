import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api';

@Component({
  selector: 'app-cardapio',
  standalone: true,
  // 1. Importe CommonModule e RouterModule
  imports: [CommonModule, RouterModule],
  templateUrl: './cardapio.html',
  styleUrl: './cardapio.scss',
})
export class CardapioComponent implements OnInit {
  // 2. Crie uma variável para guardar a lista de produtos
  public listaProdutos: any[] = [];
  public carregando: boolean = true;

  // 3. Injete o ApiService no construtor
  constructor(private apiService: ApiService) {}

  // 4. Use o ngOnInit para chamar a API quando o componente carregar
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
}
