# PayloadCMS - Guia de Configuração

Este guia explica como configurar o PayloadCMS integrado ao projeto DJ Calu.

## Índice

1. [Requisitos](#requisitos)
2. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
3. [Variáveis de Ambiente](#variáveis-de-ambiente)
4. [Executando Localmente](#executando-localmente)
5. [Deploy](#deploy)
6. [Estrutura do CMS](#estrutura-do-cms)
7. [Primeiro Acesso](#primeiro-acesso)

---

## Requisitos

- Node.js 18+ 
- MongoDB (local ou Atlas)
- npm ou pnpm

---

## Configuração do Banco de Dados

### Opção 1: MongoDB Local (Desenvolvimento)

1. **Instale o MongoDB Community Server:**
   - Windows: https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: Siga a documentação oficial

2. **Inicie o MongoDB:**
   ```bash
   # Windows (como serviço)
   net start MongoDB
   
   # Mac/Linux
   mongod --dbpath /path/to/db
   ```

3. **Use a URI padrão:**
   ```
   MONGODB_URI=mongodb://localhost:27017/caludj
   ```

### Opção 2: MongoDB Atlas (Recomendado para Produção)

1. **Crie uma conta no MongoDB Atlas:**
   - Acesse: https://www.mongodb.com/atlas

2. **Crie um Cluster:**
   - Escolha "Shared" (gratuito) ou "Dedicated"
   - Selecione a região mais próxima (ex: São Paulo - sa-east-1)

3. **Configure o acesso:**
   - Em "Database Access": Crie um usuário com senha
   - Em "Network Access": 
     - Adicione `0.0.0.0/0` para permitir qualquer IP (produção)
     - Ou adicione os IPs específicos do seu servidor

4. **Obtenha a Connection String:**
   - Clique em "Connect" > "Connect your application"
   - Copie a string e substitua `<password>` pela senha do usuário
   
   ```
   MONGODB_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/caludj?retryWrites=true&w=majority
   ```

---

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# PayloadCMS - MUDE ESTA CHAVE EM PRODUÇÃO!
PAYLOAD_SECRET=sua-chave-secreta-muito-longa-e-aleatoria

# MongoDB
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/caludj

# URL do site
NEXT_PUBLIC_SERVER_URL=https://seu-dominio.com
```

### Gerando um PAYLOAD_SECRET Seguro

```bash
# No terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Executando Localmente

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   - Copie `.env.example` para `.env.local`
   - Preencha com suas credenciais

3. **Execute o projeto:**
   ```bash
   npm run dev
   ```

4. **Acesse o Admin:**
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

---

## Deploy

### Vercel (Recomendado)

1. **Conecte seu repositório ao Vercel:**
   - Acesse: https://vercel.com
   - Importe o projeto do GitHub

2. **Configure as variáveis de ambiente:**
   No painel do Vercel, adicione:
   - `PAYLOAD_SECRET` (sua chave secreta)
   - `MONGODB_URI` (string do MongoDB Atlas)
   - `NEXT_PUBLIC_SERVER_URL` (URL do seu site)

3. **Deploy:**
   - O Vercel fará o build automaticamente

### Outras Plataformas

O projeto funciona em qualquer plataforma que suporte Next.js:
- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify

---

## Estrutura do CMS

### Collections (Conteúdo que pode ter múltiplos itens)

| Collection | Descrição |
|------------|-----------|
| **Users** | Usuários do admin |
| **Media** | Arquivos de mídia (imagens, vídeos) |
| **Tours** | Shows e eventos da agenda |
| **Sets** | Últimos sets/mixes (com links do YouTube) |
| **Gallery Images** | Imagens para a galeria Masonry |

### Globals (Configurações únicas)

| Global | Descrição |
|--------|-----------|
| **Site Settings** | Logo, backgrounds, redes sociais, textos, SEO |
| **About** | Seção "Quem Sou" - título, texto, imagem |

---

## Primeiro Acesso

### 1. Criar usuário administrador

Ao acessar `/admin` pela primeira vez, você será direcionado para criar um usuário administrador.

### 2. Configurar o Site Settings

1. Vá em **Globals > Site Settings**
2. Configure:
   - **Identidade Visual**: Upload da logo
   - **Background Hero**: Vídeos para desktop e mobile
   - **Redes Sociais**: Adicione seus links
   - **Textos**: Configure títulos e taglines
   - **SEO**: Título, descrição e imagem OG

### 3. Adicionar Conteúdo

#### Seção "Quem Sou"
1. Vá em **Globals > Seção Quem Sou**
2. Preencha título, subtítulo, parágrafos e faça upload da foto

#### Agenda de Shows
1. Vá em **Collections > Tours**
2. Clique em "Create New"
3. Preencha: data, local, cidade, status e link de ingressos

#### Últimos Sets
1. Vá em **Collections > Sets**
2. Clique em "Create New"
3. Preencha: título, ID do vídeo YouTube, ordem

#### Galeria de Fotos
1. Vá em **Collections > Gallery Images**
2. Faça upload das imagens
3. Defina a ordem de exibição

---

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar em produção
npm start

# Gerar tipos do Payload (após alterações no schema)
npm run generate:types
```

---

## Troubleshooting

### Erro de conexão com MongoDB

- Verifique se a URI está correta
- Confirme que seu IP está na whitelist do Atlas
- Verifique se o usuário tem permissões corretas

### Erro 500 no Admin

- Verifique se `PAYLOAD_SECRET` está definido
- Confirme que o MongoDB está rodando

### Imagens não carregam

- Verifique se a collection `Media` existe
- Confirme que o diretório `media` tem permissões de escrita

---

## Suporte

Para dúvidas sobre o PayloadCMS:
- Documentação: https://payloadcms.com/docs
- Discord: https://discord.com/invite/r6uj7dbMH3
- GitHub: https://github.com/payloadcms/payload
