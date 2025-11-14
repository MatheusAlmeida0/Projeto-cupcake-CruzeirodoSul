# 🧁 Loja de Cupcakes - Frontend

Uma aplicação web moderna para gerenciar e comercializar cupcakes, desenvolvida com **Angular 20** e **Bootstrap 5**. O projeto oferece tanto uma interface administrativa quanto uma interface pública para clientes.

**🌐 Acesse o projeto:** https://mayaraassef.github.io/CupcakeStoreFrontEnd/

---

## 📋 Tabela de Conteúdo

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Contribuir](#-contribuir)

---

## 📖 Sobre o Projeto

A **Loja de Cupcakes** é uma plataforma completa para gerenciamento de vendas de cupcakes artesanais. O projeto inclui:

- **Painel Administrativo**: Gerencie o catálogo de produtos
- **Área Pública**: Navegue pelo cardápio e compre

---

## ✨ Funcionalidades

### 🔐 Painel Administrativo (`/admin/produtos`)

- ✅ **Criar Produtos**: Adicione novos cupcakes ao catálogo
- ✅ **Editar Produtos**: Modifique informações de produtos existentes
- ✅ **Excluir Produtos**: Remova produtos com confirmação de segurança
- ✅ **Validação de Formulário**: Campos obrigatórios e valores mínimos
- ✅ **Notificações em Tempo Real**: Feedback imediato de ações

### 👥 Área Pública (`/`)

- ✅ **Cardápio Dinâmico**: Visualize todos os produtos disponíveis
- ✅ **Detalhes do Produto**: Veja informações completas de cada cupcake
- ✅ **Carrinho de Compras**: Adicione e gerencie produtos
- ✅ **Checkout via WhatsApp**: Finalize pedidos através do WhatsApp
- ✅ **Sobre**: Conheça mais sobre a loja
- ✅ **Unidades**: Localizações das lojas físicas
- ✅ **Notificações Visuais**: Alertas para ações do usuário

---

## 🛠️ Tecnologias

### Frontend

- **Angular 20** - Framework moderno
- **TypeScript** - Tipagem estática
- **Bootstrap 5** - Design responsivo
- **RxJS** - Programação reativa
- **Standalone Components** - Arquitetura moderna do Angular

### Testes

- **Karma** - Test runner
- **Jasmine** - Framework de testes
- **ng test** - Execução de testes

### Ferramentas

- **Node.js 20** - Runtime JavaScript
- **npm** - Gerenciador de pacotes
- **Angular CLI** - CLI do Angular

---

## 📦 Instalação

### Pré-requisitos

- Node.js 20.x ou superior
- npm 10.x ou superior

### Passos

1. **Clone o repositório**

```bash
git clone https://github.com/mayaraassef/CupcakeStoreFrontEnd.git
cd loja-cupcakes-ui
```

2. **Instale as dependências**

```bash
npm install --legacy-peer-deps
```

3. **Inicie o servidor de desenvolvimento**

```bash
npm start
```

4. **Abra o navegador**

```
http://localhost:4200
```

---

## 🚀 Uso

### Desenvolvimento Local

```bash
npm start
```

Servidor rodando em `http://localhost:4200`

### Build para Produção

```bash
npm run build
```

Arquivos compilados em `dist/loja-cupcakes-ui/browser`

### Testes Unitários

```bash
npm test
```

Executa todos os testes com cobertura

### Testes com Cobertura de Código

```bash
npm test -- --code-coverage --watch=false
```

Gera relatório em `coverage/index.html`

### Deploy no GitHub Pages

```bash
npm run deploy:ghpages
```

---

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   └── alert/              # Componente de notificações
│   ├── layouts/
│   │   ├── admin-layout/       # Layout administrativo
│   │   └── public-layout/      # Layout público
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── produto-form/   # Formulário de produtos
│   │   │   └── produto-list/   # Lista de produtos
│   │   └── public/
│   │       ├── cardapio/       # Página de cardápio
│   │       ├── cart/           # Carrinho de compras
│   │       ├── checkout/       # Checkout
│   │       ├── produto-detalhe/ # Detalhes do produto
│   │       ├── sobre/          # Página sobre
│   │       └── unidades/       # Localizações
│   ├── services/
│   │   ├── api.ts              # Comunicação com API
│   │   ├── cart.service.ts     # Gerencimento do carrinho
│   │   └── notification.service.ts # Gerencimento de notificações
│   ├── app.routes.ts           # Rotas da aplicação
│   └── app.config.ts           # Configuração do app
├── assets/                     # Imagens e arquivos estáticos
├── styles.scss                 # Estilos globais
└── index.html                  # HTML principal
```

---

## 🧪 Testes

O projeto inclui **148+ testes unitários** com alta cobertura de código:

### Cobertura

- **Statements**: 93.39% (198/212)
- **Branches**: 88.23% (30/34)
- **Functions**: 89.18% (66/74)
- **Lines**: 93% (186/200)

### Componentes Testados

✅ AlertComponent - 22 testes
✅ CartComponent - 27 testes
✅ ProdutoFormComponent - 12 testes
✅ ProdutoListComponent - 11 testes
✅ CardapioComponent - 10 testes
✅ ProdutoDetalheComponent - 14 testes
✅ CheckoutComponent - 15 testes
✅ CartService - 25 testes
✅ NotificationService - 17 testes

### Rodar Testes Específicos

```bash
npm test -- --include="**/cart.spec.ts" --watch=false
npm test -- --include="**/alert.spec.ts" --code-coverage --watch=false
```

---

## 🌐 Deploy

### GitHub Pages

```bash
npm run deploy:ghpages
```

### Netlify

Configure `netlify.toml`:

```toml
[build]
  command = "npm install && npm run build"
  publish = "dist/loja-cupcakes-ui/browser"

[build.environment]
  NODE_VERSION = "20"
```

---

## 🏗️ Arquitetura

### Padrões Utilizados

- **Standalone Components** - Componentes independentes sem NgModules
- **Service-Based Architecture** - Serviços para lógica de negócio
- **Reactive Programming** - RxJS Observables e BehaviorSubjects
- **Dependency Injection** - Injeção de dependências do Angular

### Comunicação

```
UI Components
    ↓
Services (API, Cart, Notification)
    ↓
HTTP Client
    ↓
Backend API (api-cupcake.onrender.com)
```

---

## 📱 Responsividade

- ✅ Mobile First
- ✅ Tablet Optimizado
- ✅ Desktop Completo
- ✅ Bootstrap 5 Grid System

---

## 🔗 Páginas Principais

| Página   | URL               | Descrição                |
| -------- | ----------------- | ------------------------ |
| Home     | `/`               | Cardápio principal       |
| Produto  | `/produto/:id`    | Detalhes do produto      |
| Carrinho | `/carrinho`       | Gestão do carrinho       |
| Checkout | `/checkout`       | Finalização do pedido    |
| Sobre    | `/sobre`          | Informações da loja      |
| Unidades | `/unidades`       | Localizações             |
| Admin    | `/admin/produtos` | Gerencimento de produtos |

---

## 🔄 Fluxo de Compra

```
1. Usuário acessa o home
   ↓
2. Navegando pelo cardápio
   ↓
3. Clica em um produto para detalhes
   ↓
4. Adiciona ao carrinho
   ↓
5. Acessa o carrinho (gerencia quantidade)
   ↓
6. Vai ao checkout
   ↓
7. Gera link do WhatsApp com pedido
   ↓
8. Finaliza via WhatsApp
```

---

## 📞 Contato

**Backend API:** https://api-cupcake.onrender.com

---

## 👩‍💻 Autor

**Mayara Assef**

- GitHub: [@mayaraassef](https://github.com/mayaraassef)
- Projeto: [CupcakeStoreFrontEnd](https://github.com/mayaraassef/CupcakeStoreFrontEnd)

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 🎯 Próximas Melhorias

- [ ] Autenticação de usuários
- [ ] Sistema de avaliações de produtos
- [ ] Histórico de pedidos
- [ ] Filtros avançados no cardápio
- [ ] Progressive Web App (PWA)
- [ ] Integração com pagamento online
- [ ] Dashboard de vendas

---

**Desenvolvido com ❤️ usando Angular 20**
