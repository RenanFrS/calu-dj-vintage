import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  reactCompiler: false,
  // Silencia avisos de deprecação do Sass @import (usados pelo Payload CMS)
  sassOptions: {
    silenceDeprecations: ['import'],
    quietDeps: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'player.cloudinary.com',
      },
      // Permite carregar mídias servidas localmente pelo Payload em desenvolvimento
      {
        protocol: 'http' as const,
        hostname: 'localhost',
      },
    ],
  },
  // Transpile PayloadCMS packages
  transpilePackages: ['@payloadcms/next', '@payloadcms/richtext-lexical'],
};

export default withPayload(nextConfig);
