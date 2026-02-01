/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import '@payloadcms/next/css'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'

import './custom.scss'
import { importMap } from './admin/importMap'

export const runtime = 'nodejs'

type Args = {
  children: React.ReactNode
}

// Server Action que delega para o utilitário do pacote
async function serverFunction(payload: { name: string; args?: any }) {
  'use server'

  const { default: config } = await import('@payload-config')

  return handleServerFunctions({
    name: payload.name,
    args: payload.args,
    config: Promise.resolve(config),
    importMap,
  })
}

// Layout awaits config at runtime so we pass an intact config to Payload
const Layout = async ({ children }: Args) => {
  const { default: config } = await import('@payload-config')
  const safeConfig = JSON.parse(JSON.stringify(config))

  return (
    <RootLayout config={safeConfig} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  )
}

export default Layout
