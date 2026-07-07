import { getPayload as getPayloadServer } from 'payload'
import configPromise from '@payload-config'

export const getPayload = async () => {
  return getPayloadServer({ config: configPromise })
}

// Profundidade padrão para popular relações com Media nas queries do frontend.
const DEFAULT_DEPTH = 2

export async function getSiteSettings() {
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'site-settings', depth: DEFAULT_DEPTH })
}

export async function getAbout() {
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'about', depth: DEFAULT_DEPTH })
}

export async function getTours(limit = 10) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'tours',
    sort: 'date',
    limit,
    depth: DEFAULT_DEPTH,
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
    depth: DEFAULT_DEPTH,
  })
  return result.docs
}

export async function getGalleryImages(limit = 20) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'gallery-images',
    sort: 'order',
    limit,
    depth: DEFAULT_DEPTH,
  })
  return result.docs
}

export async function getReviews(limit = 12) {
  const payload = await getPayload()
  const result = await payload.find({
    collection: 'reviews',
    sort: ['-featured', 'order', '-date'],
    limit,
    depth: DEFAULT_DEPTH,
  })
  return result.docs
}
