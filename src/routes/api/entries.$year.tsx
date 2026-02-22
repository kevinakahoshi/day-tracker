import { db } from '#/db/index'
import { dailyEntries } from '#/db/schema'
import { auth } from '#/lib/auth'
import { createFileRoute } from '@tanstack/react-router'
import { and, eq, gte, lte } from 'drizzle-orm'

export const Route = createFileRoute('/api/entries/$year')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        const year = parseInt((params as any).year)
        if (isNaN(year)) {
          return new Response(JSON.stringify({ error: 'Invalid year' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }

        try {
          const startDate = `${year}-01-01`
          const endDate = `${year}-12-31`

          const entries = await db
            .select()
            .from(dailyEntries)
            .where(
              and(
                eq(dailyEntries.userId, session.user.id),
                gte(dailyEntries.entryDate, startDate),
                lte(dailyEntries.entryDate, endDate)
              )
            )

          return new Response(JSON.stringify(entries), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error) {
          console.error('Error fetching entries:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to fetch entries' }),
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
