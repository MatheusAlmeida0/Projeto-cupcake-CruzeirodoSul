import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly BASE_URL = 'https://api-cupcake.onrender.com';

  constructor(private http: HttpClient) {}

  public getProdutos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}/produtos`);
  }

  public getProdutoById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.BASE_URL}/produtos/${id}`);
  }

  public createProduto(produto: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/produtos`, produto);
  }

  public updateProduto(id: string | number, produto: any): Observable<any> {
    return this.http.put<any>(`${this.BASE_URL}/produtos/${id}`, produto);
  }

  public deleteProduto(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.BASE_URL}/produtos/${id}`);
  }
}
