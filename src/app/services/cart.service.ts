import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  constructor() {}

  public getCart(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  public getCartItemCount(): Observable<number> {
    return this.cartSubject.asObservable().pipe(map((items) => items.length));
  }

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
    this.updateCartSubject();
  }

  public removeItem(id_produto: number): void {
    this.cartItems = this.cartItems.filter((item) => item.id_produto !== id_produto);
    this.updateCartSubject();
  }

  public updateItemQuantity(id_produto: number, quantidade: number): void {
    const item = this.cartItems.find((i) => i.id_produto === id_produto);
    if (item) {
      if (quantidade <= 0) {
        this.removeItem(id_produto);
      } else {
        item.quantidade = quantidade;
        this.updateCartSubject();
      }
    }
  }

  public clearCart(): void {
    this.cartItems = [];
    this.updateCartSubject();
  }

  public getCartTotal(): Observable<number> {
    return this.cartSubject
      .asObservable()
      .pipe(map((items) => items.reduce((sum, item) => sum + item.valor * item.quantidade, 0)));
  }

  private updateCartSubject(): void {
    this.cartSubject.next([...this.cartItems]);
  }
}
