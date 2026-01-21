import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const s3Bucket = process.env.S3_BUCKET;
const s3Region = process.env.S3_REGION;
const s3Endpoint = process.env.S3_ENDPOINT;

// Tenta extrair o hostname limpo do endpoint do R2 (remove https://)
const r2Hostname = s3Endpoint ? new URL(s3Endpoint).hostname : null;

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https' as const,
        hostname: 's3.amazonaws.com',
      },
      // Configuração dinâmica para S3/R2
      ...(s3Bucket && s3Region
        ? [
            {
              protocol: 'https' as const,
              hostname: `${s3Bucket}.s3.${s3Region}.amazonaws.com`,
            },
          ]
        : []),
      // Configuração específica para o Cloudflare R2
      ...(r2Hostname
        ? [
            {
              protocol: 'https' as const,
              hostname: r2Hostname,
            },
          ]
        : []),
    ],
  },
  // Transpile PayloadCMS packages
  transpilePackages: ['@payloadcms/next', '@payloadcms/richtext-lexical'],
};

export default withPayload(nextConfig);