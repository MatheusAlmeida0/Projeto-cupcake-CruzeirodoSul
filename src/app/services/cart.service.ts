import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Adicione map

interface CartItem {
  id_produto: number;
  nome: string;
  valor: number;
  caminho_imagem: string;
  quantidade: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject(this.cartItems);

  constructor() {
    // REMOVA OU COMENTE ESTA LINHA PARA QUE O CARRINHO SEJA SEMPRE LIMPO AO RECARREGAR
    // this.loadCartFromLocalStorage();
  }

  public getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  // Obtém a contagem total de itens (tipos de produtos) no carrinho
  public getCartItemCount(): Observable<number> {
    // Usando o operador map do rxjs para simplificar
    return this.cartSubject.asObservable().pipe(map((items) => items.length));
  }

  // Adiciona um produto ao carrinho
  public addToCart(produto: any): void {
    const existingItem = this.cartItems.find((item) => item.id_produto === produto.id_produto);

    if (existingItem) {
      existingItem.quantidade++;
    } else {
      this.cartItems.push({
        id_produto: produto.id_produto,
        nome: produto.nome,
        valor: produto.valor,
        caminho_imagem: produto.caminho_imagem,
        quantidade: 1,
      });
    }
    this.updateCartSubject(); // Apenas atualiza o Subject, sem localStorage
  }

  // Remove completamente um tipo de produto do carrinho
  public removeItem(id_produto: number): void {
    this.cartItems = this.cartItems.filter((item) => item.id_produto !== id_produto);
    this.updateCartSubject(); // Apenas atualiza o Subject, sem localStorage
  }

  // Atualiza a quantidade de um item no carrinho
  public updateItemQuantity(id_produto: number, quantidade: number): void {
    const item = this.cartItems.find((i) => i.id_produto === id_produto);
    if (item) {
      if (quantidade <= 0) {
        this.removeItem(id_produto); // Se a quantidade for 0 ou menos, remove o item
      } else {
        item.quantidade = quantidade;
        this.updateCartSubject(); // Apenas atualiza o Subject, sem localStorage
      }
    }
  }

  // Limpa todo o carrinho
  public clearCart(): void {
    this.cartItems = [];
    this.updateCartSubject(); // Apenas atualiza o Subject, sem localStorage
    // REMOVA OU COMENTE: localStorage.removeItem('cupcake_cart'); // Não precisamos mais disso
  }

  // Calcula o total do carrinho
  public getCartTotal(): Observable<number> {
    return this.cartSubject
      .asObservable()
      .pipe(map((items) => items.reduce((sum, item) => sum + item.valor * item.quantidade, 0)));
  }

  private updateCartSubject(): void {
    this.cartSubject.next([...this.cartItems]);
  }
}
