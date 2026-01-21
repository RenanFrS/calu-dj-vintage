import fs from 'fs'
import { Readable } from 'stream'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

type UploadFile = {
  data?: Buffer // Adicionado para compatibilidade
  path?: string
  buffer?: Buffer
  stream?: NodeJS.ReadableStream
  originalname?: string
  filename?: string
  mimetype?: string
  size?: number
}

export const r2Adapter = ({ bucket, accountId, endpoint, folder }: { bucket: string; accountId?: string; endpoint?: string; folder?: string }) => {
  if (!bucket) {
    throw new Error('R2 adapter requires bucket')
  }

  // Define o endpoint. Se não passado explicitamente, tenta montar com o accountId
  const r2Endpoint = endpoint || process.env.S3_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined)
  
  if (!r2Endpoint) {
    throw new Error('R2 adapter requires endpoint or accountId')
  }

  const client = new S3Client({
    endpoint: r2Endpoint,
    region: 'auto',
    forcePathStyle: true, // Obrigatório para R2 na maioria dos casos
    credentials: {
      // Usa as variáveis que definimos no passo a passo anterior
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!, 
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })

  const upload = async ({ file }: { file: UploadFile }) => {
    const body = file.data || file.buffer || (file.path ? fs.createReadStream(file.path) : file.stream);

    if (!body) throw new Error('No file data to upload')

    const filename = `${Date.now()}-${(file.originalname || file.filename || 'file')}`
    const Key = folder ? `${folder}/${filename}` : filename

    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key,
      Body: body as any, // Correção do erro de tipo
      ContentType: file.mimetype,
      // R2 não usa ACL da mesma forma que o S3, melhor omitir para evitar erros de "NotImplemented"
    }))

    // Tenta usar o endpoint público se disponível, ou constrói a URL direta do bucket
    const url = `${r2Endpoint.replace(/\/$/, '')}/${bucket}/${Key}`

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