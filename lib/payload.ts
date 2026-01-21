import { getPayload as getPayloadClient } from 'payload'
import config from '@payload-config'

export const getPayload = async () => {
  return getPayloadClient({ config })
}

// Funções auxiliares para buscar dados
export async function getSiteSettings() {
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'site-settings' })
}

export async function getAbout() {
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'about' })
}

export async function getTours(limit = 10) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'tours',
    sort: 'date',
    limit,
    where: {
      date: {
        greater_than_equal: new Date().toISOString(),
      },
    },
  })
  return result.docs
}

export async function getSets(limit = 10) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'sets',
    sort: 'order',
    limit,
  })
  return result.docs
}

export async function getGalleryImages(limit = 20) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'gallery-images',
    sort: 'order',
    limit,
  })
  return result.docs
}
