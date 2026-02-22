import { db } from '#/db/index'
import { dailyEntries } from '#/db/schema'
import { auth } from '#/lib/auth'
import { createFileRoute } from '@tanstack/react-router'
import { and, eq } from 'drizzle-orm'

export const Route = createFileRoute('/api/new-entry')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        const body = await request.json()
        const { entryDate, rating, note } = body

        if (!entryDate || !rating) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }

        if (rating < 1 || rating > 5) {
          return new Response(
            JSON.stringify({ error: 'Rating must be between 1 and 5' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }

        // Check if entry for this date already exists
        const existing = await db
          .select()
          .from(dailyEntries)
          .where(
            and(
              eq(dailyEntries.userId, session.user.id),
              eq(dailyEntries.entryDate, entryDate)
            )
          )

        try {
          if (existing.length > 0) {
            // Update existing entry
            await db
              .update(dailyEntries)
              .set({
                rating,
                note: note || null,
                updatedAt: new Date(),
              })
              .where(
                and(
                  eq(dailyEntries.userId, session.user.id),
                  eq(dailyEntries.entryDate, entryDate)
                )
              )
          } else {
            // Create new entry
            await db.insert(dailyEntries).values({
              userId: session.user.id,
              entryDate,
              rating,
              note: note || null,
            })
          }

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          console.error('Error saving entry:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to save entry' }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }
      },
    },
  },
})
