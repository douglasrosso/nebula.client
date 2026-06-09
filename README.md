# Nebula Client — Frontend

Interface da plataforma Nebula, uma loja de jogos digitais com catálogo, biblioteca, wishlist, chat em tempo real e sistema de amizades.

> Backend: [nebula.api](../nebula.api/README.md)

---

## Stack

| | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript 5.7 |
| Estilos | Tailwind CSS 4, Styled Components |
| Estado | Zustand (com persistência em localStorage) |
| Formulários | React Hook Form + Zod |
| Componentes | Radix UI |
| Tempo real | SignalR (@microsoft/signalr) |
| Gráficos | Recharts |

---

## Pré-requisitos

- Node.js 20+
- Backend `nebula.api` rodando em `http://localhost:5000`

---

## Configuração e execução

```bash
npm install
npm run dev
```

Frontend disponível em: `http://localhost:3000`

> As chamadas para `/api/*` e `/hubs/*` são repassadas automaticamente ao backend via rewrite configurado em `next.config.ts` — nenhuma variável de ambiente de URL é necessária.

---

## Páginas

### `/login`
Autenticação do usuário. Email e senha com validação client-side. Credenciais de teste: `admin@nebula.com` / `Admin@123`.

### `/cadastro`
Cadastro de novo usuário. Valida senhas, exibe erros da API e redireciona automaticamente após o registro.

### `/loja`
Catálogo completo de jogos com:
- Busca por título
- Filtro por gênero (carregado da API)
- Filtro de faixa de preço (R$0–500)
- Ordenação por relevância, preço, nome e rating
- Sidebar no desktop, drawer no mobile

### `/jogo/[id]`
Detalhe do jogo. Exibe descrição, screenshots, requisitos de sistema, reviews e botões de compra/wishlist com estado em tempo real.

### `/biblioteca`
Jogos adquiridos pelo usuário. Modos de visualização em grid e lista, busca local e preview da wishlist.

### `/lista-desejos`
Wishlist com valor total, desconto calculado e ação de compra direta por item.

### `/chat`
Chat em tempo real via SignalR com três abas:
- **Amigos** — histórico de conversa com leitura/escrita em tempo real
- **Solicitações** — aceitar ou recusar pedidos de amizade
- **Adicionar** — buscar e adicionar novos amigos

---

## Estrutura de pastas

```
nebula.client/
├── app/
│   ├── login/
│   ├── cadastro/
│   ├── loja/
│   ├── biblioteca/
│   ├── lista-desejos/
│   ├── chat/
│   └── jogo/[id]/
├── lib/
│   ├── api.ts        # Cliente HTTP para todos os endpoints
│   ├── store.ts      # Estado global com Zustand
│   └── hooks/        # useGames, useGame, useSignalRContext
└── components/       # Componentes reutilizáveis
```

---

## Estado global (Zustand)

O store centraliza:

| Fatia | O que guarda |
|---|---|
| Auth | Usuário autenticado, loading, login/logout |
| Library | IDs dos jogos adquiridos |
| Wishlist | IDs dos jogos na wishlist |
| Filtros | Busca, gêneros, preço, ordenação da loja |
| Mensagens | Não lidos por amigo, solicitações pendentes |

Todo o estado é persistido em `localStorage` via middleware do Zustand.

---

## Cliente HTTP (`lib/api.ts`)

Módulos exportados:

| Módulo | Endpoints cobertos |
|---|---|
| `authApi` | login, logout |
| `usersApi` | me, create, update |
| `gamesApi` | list, getById, genres |
| `reviewsApi` | CRUD + helpful/funny |
| `cartApi` | get, add, remove, clear |
| `wishlistApi` | get, add, remove |
| `libraryApi` | get, isOwned |
| `purchaseApi` | checkout |
| `ordersApi` | list, getById |
| `friendsApi` | list, requests, search, add, accept, remove |
| `messagesApi` | getConversation, send, markRead |

Todas as requisições incluem credenciais (cookie JWT) automaticamente.

---

## Tempo real (SignalR)

O hook `useSignalRContext()` gerencia a conexão com `/hubs/chat`.

| Ação | Descrição |
|---|---|
| `sendMessage(friendId, content)` | Envia mensagem |
| `onMessage(cb)` | Recebe nova mensagem |
| `onMessagesRead(cb)` | Notifica leitura pelo outro lado |
| `onFriendRequestReceived(cb)` | Nova solicitação de amizade |
| `onFriendRequestAccepted(cb)` | Solicitação aceita |

---

## Fluxo de compra

1. Usuário clica em "Comprar" (loja, wishlist ou detalhe do jogo)
2. `purchase(game)` no store adiciona o jogo ao carrinho e executa checkout
3. Backend cria o pedido e registra na biblioteca
4. Store atualiza `library` e remove da `wishlist`
5. Toast de confirmação é exibido
