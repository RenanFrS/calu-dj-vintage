import { revalidatePath } from 'next/cache'

/**
 * Hook handler que invalida o cache do Next.js para a home logo após
 * a coleção/global ser alterada no Payload.
 */
export const revalidateHomeAfterChange = async () => {
  try {
    revalidatePath('/', 'layout')
  } catch (err) {
    // revalidatePath só pode ser chamado em contexto de rota Next.js.
    // Em contextos de CLI (seed, migrações) isso pode lançar — ignoramos.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[revalidate] ignorado:', err instanceof Error ? err.message : err)
    }
  }
}
