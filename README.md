# calu-dj-vintage ⚡️

**Vintage DJ site** com Next.js e Payload CMS — pronto para rodar localmente e fazer deploy no Vercel. Este repositório armazena os arquivos do frontend e a configuração do Payload (CMS) com suporte a uploads via Cloudflare R2 (compatível com S3).

---

## 🚀 Rápido: rodando localmente

1. Instale dependências:

```bash
npm install
```

2. Copie o arquivo de exemplo de variáveis de ambiente e ajuste os valores:

```bash
cp .env.example .env
# editar .env com suas chaves
```

3. Rodar em dev:

```bash
npm run dev
```

Abra http://localhost:3000 e acesse o Payload Admin para testar uploads.

---

## 🔧 Variáveis de ambiente (principais)

Defina no seu ambiente local e no Vercel (Production + Preview):

- `MONGODB_URI` - conexão MongoDB Atlas
- `PAYLOAD_SECRET` - segredo do Payload
- `NEXT_PUBLIC_SERVER_URL` - URL do site (ex.: `https://seu-site.vercel.app`)

Cloudflare R2 (recomendado):
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `R2_ACCOUNT_ID` (ou `R2_ENDPOINT`) - opcional
- `R2_FOLDER` - opcional (pasta dentro do bucket)

(compatível: também suportamos S3 via `S3_BUCKET`, `S3_REGION`, etc.)

> ❗ Não commite arquivos `.env`.

---

## ☁️ Configurando o Cloudflare R2 (resumo)

1. No painel Cloudflare, crie um **R2 bucket**.
2. Gere uma **Access Key / Secret** (ou use API Token com permissão R2). Guarde em `R2_ACCESS_KEY_ID` e `R2_SECRET_ACCESS_KEY`.
3. Se quiser usar o endpoint por conta, defina `R2_ACCOUNT_ID` ou `R2_ENDPOINT`.
4. No Vercel, adicione as variáveis acima em **Project → Settings → Environment Variables**.
5. Deploy no Vercel; ao enviar mídias pelo Payload, os arquivos serão salvos no R2 e servidos por `https://<account>.r2.cloudflarestorage.com/<bucket>/<key>` (ou por custom domain se configurado).

---

## ✅ Deploy no Vercel

- Crie o projeto no Vercel e conecte ao repositório `calu-dj-vintage`.
- Defina as variáveis de ambiente citadas acima (Production + Preview).
- O build padrão é `npm run build` (Next.js) — Vercel detecta automaticamente.

---

## 📄 Scripts úteis

- `npm run dev` – desenvolvimento
- `npm run build` – build de produção
- `npm run start` – iniciar build localmente
- `npm run generate:types` – gerar tipos do Payload

---

## 🧪 Testando uploads

- Acesse o Admin do Payload e envie uma imagem/vídeo na coleção `Media`.
- Verifique que o campo `url` do arquivo aponta para o endpoint do R2 e que o arquivo está acessível no browser.

---

## 📁 Arquivos importantes

- `payload.config.ts` – configuração do Payload
- `collections/Media.ts` – configurações de upload (adapter selecionável: R2/S3)
- `lib/r2Adapter.ts` – adapter R2
- `.env.example` – variáveis de ambiente de exemplo

---

## 🤝 Contribuição

Contribuições são bem-vindas! Abra issues ou PRs com mudanças pequenas e descreva o propósito.

---



