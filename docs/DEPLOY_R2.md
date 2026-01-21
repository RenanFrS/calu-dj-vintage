# Deploy com Cloudflare R2 🧰

Este documento descreve passo-a-passo como criar um bucket no **Cloudflare R2**, gerar as chaves de acesso e configurar as variáveis de ambiente no **Vercel** para que o seu projeto entregue arquivos (imagens/vídeos) usando o adapter R2 incluído no projeto.

---

## Pré-requisitos

- Conta Cloudflare com acesso ao R2
- Conta Vercel com o projeto conectado ao repositório
- Acesso ao painel do repositório no GitHub (para criar o repositório se necessário)

---

## 1) Criar o bucket no Cloudflare R2

1. Abra o painel do Cloudflare e selecione o domínio (ou vá para o Painel R2 diretamente).
2. Navegue em **R2** → **Buckets** → **Create bucket**.
3. Dê um nome ao bucket (ex.: `calu-dj-media`) e confirme.

Observação: o nome do bucket será usado na variável `R2_BUCKET`.

---

## 2) Gerar Access Key / Secret (Credentials)

1. Em **R2** → **Access keys** clique em **Create access key** (ou crie um API Token com permissões R2 se preferir).
2. Copie a **Access Key** e o **Secret** — o _secret_ é mostrado **uma vez**. Salve em local seguro.

Variáveis correspondentes:
- `R2_ACCESS_KEY_ID` = Access Key
- `R2_SECRET_ACCESS_KEY` = Secret
- `R2_BUCKET` = nome do bucket
- `R2_ACCOUNT_ID` ou `R2_ENDPOINT` (opcional) = account-specific endpoint (ex.: `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`)

---

## 3) (Opcional) CORS e permissões

- Se você servir arquivos diretamente do bucket para browsers de outros domínios, configure regras CORS no painel R2 (Bucket settings) para permitir seu domínio (ex.: `https://seu-site.vercel.app`).

Exemplo de regras CORS (conceito):
```json
[
  {
    "AllowedOrigins": ["https://seu-site.vercel.app"],
    "AllowedMethods": ["GET","HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3000
  }
]
```

> Nota: o Cloudflare R2 costuma servir arquivos publicamente via endpoint do account/bucket; se preferir unificá-los em `assets.seu-dominio.com` você pode usar um Cloudflare Worker ou configurar um subdomínio com regras do Cloudflare.

---

## 4) Adicionar variáveis no Vercel 🔐

No Vercel, abra o projeto → **Settings** → **Environment Variables** e adicione (para `Preview` e `Production`):

- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `R2_ACCOUNT_ID` ou `R2_ENDPOINT` (opcional)
- `R2_FOLDER` (opcional, ex.: `media`)
- `MONGODB_URI`
- `PAYLOAD_SECRET`
- `NEXT_PUBLIC_SERVER_URL` (ex.: `https://seu-site.vercel.app`)

Depois de adicionar, crie um novo deploy (Vercel rebuild) para que as variáveis entrem em vigor.

---

## 5) Testando localmente antes do deploy

1. Copie `.env.example` para `.env` e preencha as chaves R2.
2. Rode `npm install` (caso ainda não tenha instalado) e `npm run dev`.
3. No admin do Payload, tente fazer upload de uma imagem/video na coleção `Media`.
4. Verifique o registro do arquivo: o campo `url` deve apontar para `https://<account>.r2.cloudflarestorage.com/<bucket>/<key>` ou para o endpoint fornecido.

---

## 6) Verificando no deploy (Vercel)

- Após deploy, acesse o Admin do Payload no ambiente de produção/preview e realize um upload.
- Abra a `url` retornada em um browser público. Se houver erro 403/404:
  - Verifique as credenciais `R2_ACCESS_KEY_ID`/`R2_SECRET_ACCESS_KEY` no Vercel.
  - Confirme o `R2_BUCKET` e `R2_ENDPOINT`/`R2_ACCOUNT_ID`.
  - Revise regras CORS (se estiver carregando via frontend direto).

---

## 7) Dicas e boas práticas ⚠️

- Não commite chaves em repositório — use variáveis de ambiente no Vercel.
- Se precisa de imagens otimizadas e transformação on-the-fly, avalie usar Cloudflare Images (se aplicável) ou servir via Worker que adapte imagens.
- Para grandes vídeos, monitore custo de saída/transferência; R2 costuma ser mais barato, mas é bom acompanhar contadores.

---

## 8) Troubleshooting rápido

- Erro: *Access Denied / 403* → chaves inválidas ou bucket incorreto.
- Erro: *CORS* → configurar AllowedOrigins corretamente.
- Arquivos não aparecem no browser → teste acessar diretamente o endpoint e verifique se a URL gerada pelo adapter bate com o formato do endpoint.

---

## Comandos úteis (exemplo Node snippet para listar objetos)

```js
// test-list.js
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

const client = new S3Client({
  endpoint: process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
})

const run = async () => {
  const out = await client.send(new ListObjectsV2Command({ Bucket: process.env.R2_BUCKET }))
  console.log(out)
}

run().catch(console.error)
```

> Rode com `node -r dotenv/config test-list.js` com `.env` preenchido para checar conectividade.

---

## Quer que eu gere prints / imagens? 📸

Posso adicionar imagens passo-a-passo (screenshots) mostrando: criação do bucket, geração das chaves e onde colar as variáveis no Vercel. Quer que eu inclua essas imagens e publique aqui no `docs/DEPLOY_R2.md`? Se sim, me envie as imagens ou autorize eu gerar imagens guiadas e eu adiciono. 

---

Se preferir que eu faça a configuração completa (criar scripts de verificação, adicionar um Worker de CDN ou configurar um subdomínio para assets), diga qual opção prefere que eu siga. Estou pronto para prosseguir. ✅