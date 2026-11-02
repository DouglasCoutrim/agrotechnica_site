# Agrotechnica | Site institucional + painel administrativo

Next.js 15 (App Router) · Tailwind v4 · MariaDB (`mysql2`) · login próprio (bcrypt + JWT em cookie) · upload com `sharp`.

- Site público: páginas dinâmicas lidas do MariaDB, com cache que se atualiza sozinho ao salvar no painel.
- Painel: `/admin` (login obrigatório). Gerencia textos, serviços, peças, promoções, blog, portfólio, equipe, depoimentos, FAQ, mensagens do WhatsApp, configurações gerais, usuários e biblioteca de imagens.
- Sem banco, o site abre com conteúdo padrão (útil para revisar o visual).

## Estrutura
```
app/(site)/        páginas públicas
app/admin/         login, primeiro acesso e painel
app/api/           contato, upload e biblioteca de mídia
app/uploads/       serve as imagens enviadas
components/        ui/, site/, admin/
lib/               db, auth, queries (com cache), defaults, whatsapp, seo, admin/resources
db/schema.sql      tabelas  |  db/seed.sql  configurações iniciais
public/brand       logo, drone Agras, bateria DJI
public/placeholders ilustrações genéricas (usadas onde ainda não há foto)
```

## Deploy na Hostinger (plano Unlimited, aplicação Node.js)

### 1. Banco de dados
1. hPanel > **Bancos de dados** > crie um banco MariaDB, usuário e senha. Anote os 3 nomes exatos (têm prefixo, ex.: `u123456789_agro`).
2. **phpMyAdmin** > selecione o banco > **Importar** `db/schema.sql`, depois `db/seed.sql`.

### 2. Aplicação
1. hPanel > **Sites** > **Importar site / Aplicação web Node.js** > conecte o GitHub e escolha este repositório, branch `main`.
2. Node 20 ou 22 · build `npm run build` · start `npm start` · pasta raiz = raiz do repositório.
3. **Variáveis de ambiente** (cadastre ANTES do primeiro deploy):

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.agrotechnica.site` |
| `DB_HOST` | `localhost` |
| `DB_PORT` | `3306` |
| `DB_NAME` / `DB_USER` / `DB_PASSWORD` | os do passo 1 |
| `AUTH_SECRET` | texto aleatório com 32+ caracteres |
| `SETUP_TOKEN` | chave de 12+ caracteres para o primeiro acesso |
| `UPLOAD_DIR` | pasta FORA do app, ex.: `/home/u123456789/agrotechnica-uploads` |

   Gere o `AUTH_SECRET` com: `openssl rand -base64 32` (ou use um gerador de senhas).
4. Faça o deploy. Depois conecte o domínio **www.agrotechnica.site** e ative o SSL (HTTPS é obrigatório: o cookie de login só funciona em HTTPS).

### 3. Primeiro acesso
1. Abra `https://www.agrotechnica.site/admin/setup`.
2. Informe a `SETUP_TOKEN`, seu e-mail e uma senha (mínimo 10 caracteres). Isso cria o administrador.
3. Entre em `/admin`. Vá em **Textos das páginas** > **Criar textos padrão** para liberar a edição de todos os textos do site.
4. Em **Configurações gerais**: endereço completo, e-mail, horários, link do mapa e redes sociais.
5. Suba as fotos reais e vincule em serviços, peças, equipe etc. Onde não há foto, o site mostra uma ilustração genérica.
6. Depois de criar o administrador, pode remover `SETUP_TOKEN` das variáveis.

### Atualizações
Cada `git push` na branch `main` dispara novo deploy. O conteúdo editado no painel fica no banco e nas imagens em `UPLOAD_DIR`, então não é perdido em novos deploys.

## Rodar localmente
```bash
npm install
cp .env.example .env.local     # preencha DB_*, AUTH_SECRET e SETUP_TOKEN
# importe db/schema.sql e db/seed.sql no seu MariaDB/MySQL local
npm run dev
```

## Segurança (resumo)
Senhas com bcrypt (custo 12) · bloqueio de 15 min após 5 erros · cookie HttpOnly + Secure + SameSite · `/admin` e `/api/admin` protegidos por middleware e revalidados em cada ação · upload só aceita imagens reais (reprocessadas para WebP) · consultas SQL parametrizadas · formulário público com honeypot e limite por IP.

## Observações
- Textos longos (serviços, blog, sobre) são texto simples: separe parágrafos com uma linha em branco.
- Produtos não exibem preço: o botão sempre abre o WhatsApp com o nome do item.
- Faça backup periódico do banco (phpMyAdmin > Exportar) e da pasta `UPLOAD_DIR`.
