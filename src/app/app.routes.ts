import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout';
import { CardapioComponent } from './pages/public/cardapio/cardapio';
import { ProdutoDetalheComponent } from './pages/public/produto-detalhe/produto-detalhe';
import { SobreComponent } from './pages/public/sobre/sobre';
import { UnidadesComponent } from './pages/public/unidades/unidades';
import { ProdutoListComponent } from './pages/admin/produto-list/produto-list';
import { ProdutoFormComponent } from './pages/admin/produto-form/produto-form';
import { CartComponent } from './pages/public/cart/cart';
import { CheckoutComponent } from './pages/public/checkout/checkout';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: CardapioComponent },
      { path: 'sobre', component: SobreComponent },
      { path: 'unidades', component: UnidadesComponent },
      { path: 'produto/:id', component: ProdutoDetalheComponent },
      { path: 'carrinho', component: CartComponent }, // <--- AGORA ESTÃO AQUI!
      { path: 'checkout', component: CheckoutComponent }, // <--- E AQUI!
    ],
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'produtos', pathMatch: 'full' },
      { path: 'produtos', component: ProdutoListComponent },
      { path: 'produtos/novo', component: ProdutoFormComponent },
      { path: 'produtos/editar/:id', component: ProdutoFormComponent },
    ],
  },
];
