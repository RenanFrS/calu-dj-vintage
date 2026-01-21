import fs from 'fs'
import { Readable } from 'stream'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

// Atualizei a tipagem para incluir 'data', que é comum no Payload
type UploadFile = {
  data?: Buffer
  path?: string
  buffer?: Buffer
  stream?: NodeJS.ReadableStream
  originalname?: string
  filename?: string
  mimetype?: string
  size?: number
}

export const s3Adapter = ({ bucket, region, folder }: { bucket: string; region: string; folder?: string }) => {
  // Pega o endpoint do ambiente (necessário para R2)
  const endpoint = process.env.S3_ENDPOINT;

  const client = new S3Client({
    region: region || 'auto',
    endpoint: endpoint, // Importante para R2
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    // forcePathStyle é frequentemente necessário para compatibilidade com R2/MinIO
    forcePathStyle: !!endpoint, 
  })

  const upload = async ({ file }: { file: UploadFile }) => {
    // Prioriza file.data (Payload Buffer) ou file.buffer
    const body = file.data || file.buffer || (file.path ? fs.createReadStream(file.path) : file.stream);

    if (!body) {
      throw new Error('No file data to upload')
    }

    const filename = `${Date.now()}-${(file.originalname || file.filename || 'file')}`
    const Key = folder ? `${folder}/${filename}` : filename

    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key,
      Body: body as any, // O 'as any' resolve o erro de tipagem do TypeScript
      ContentType: file.mimetype,
      // Se for R2, ACL geralmente não é suportado/necessário da mesma forma, 
      // mas mantemos para compatibilidade geral se não quebrar.
      // Se der erro de ACL no R2, remova a linha abaixo.
      // ACL: 'public-read', 
    }))

    // Lógica para gerar a URL correta (R2 ou S3 padrão)
    let url;
    if (endpoint) {
      // Formato R2: https://pub-<hash>.r2.dev/arquivo ou custom domain
      // Aqui usamos a estrutura bruta do endpoint + bucket se não houver domínio público configurado
      url = `${endpoint.replace(/\/$/, '')}/${bucket}/${Key}`;
    } else {
      // Formato AWS S3 Padrão
      url = `https://${bucket}.s3.${region}.amazonaws.com/${Key}`;
    }

    return {
      filename: Key,
      url,
      mimeType: file.mimetype,
      size: file.size,
    }
  }

  const remove = async ({ file }: { file: { filename?: string; key?: string } }) => {
    const Key = file.filename || file.key
    if (!Key) return
    await client.send(new DeleteObjectCommand({ Bucket: bucket, Key }))
  }

  return {
    upload,
    delete: remove,
  }
}