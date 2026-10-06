import { enquirySchema } from '#shared/enquiry'

/**
 * Prototype enquiry endpoint: validates and logs. Email delivery is added after client approval.
 * Returns a reference the pilgrim can quote on WhatsApp.
 */
export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, body => enquirySchema.safeParse(body))
  if (!result.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Invalid enquiry',
      data: { issues: result.error.issues.map(i => ({ path: i.path.join('.'), message: i.message })) },
    })
  }

  const reference = `AFZ-${Math.floor(10000 + Math.random() * 90000)}`
  console.info('[enquiry]', reference, JSON.stringify({ ...result.data, receivedAt: new Date().toISOString() }))

  return { ok: true as const, reference }
})
