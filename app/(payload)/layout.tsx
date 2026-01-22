/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'

import './custom.scss'
import { importMap } from './admin/importMap'

type Args = {
  children: React.ReactNode
}

// Server Action que delega para o utilitário do pacote
async function serverFunction(payload: { name: string; args?: any }) {
  'use server'

  return handleServerFunctions({
    name: payload.name,
    args: payload.args,
    config: Promise.resolve(config),
    importMap,
  })
}

// Clone/config without functions so it can be serialized to client components
const safeConfig = JSON.parse(JSON.stringify(config))

const Layout = ({ children }: Args) => (
  <RootLayout config={safeConfig} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
