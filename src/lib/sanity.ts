import sanityClient from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID || ''
const dataset = process.env.SANITY_DATASET || 'production'

export const client = sanityClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
})
