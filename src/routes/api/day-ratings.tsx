import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { day_ratings } from '@/db/schema'
import { eq } from 'drizzle-orm'

type YearInput = { year: number }
type DayInput = { day: string }
type UpsertInput = { day: string; rating: number | null; note?: string | null }

export const getYearRatings = createServerFn({ method: 'GET' })
  .inputValidator((input: YearInput) => input)
  .handler(async ({ input }) => {
    const rows = await db.query.day_ratings.findMany()
    return rows.filter((r) => new Date(r.day as any).getFullYear() === input.year)
  })

export const getDay = createServerFn({ method: 'GET' })
  .inputValidator((input: DayInput) => input)
  .handler(async ({ input }) => {
    const rows = await db.query.day_ratings.findMany()
    return rows.find((r) => {
      const d = new Date(r.day as any).toISOString().slice(0, 10)
      return d === input.day
    })
  })

export const upsertRating = createServerFn({ method: 'POST' })
  .inputValidator((input: UpsertInput) => input)
  .handler(async ({ input }) => {
    // delete existing (simple upsert)
    await db.delete(day_ratings).where(eq(day_ratings.day, input.day))
    if (input.rating === null || input.rating === undefined) {
      // if no rating provided, just ensure deleted
      return { success: true }
    }
    await db.insert(day_ratings).values({
      day: input.day,
      rating: input.rating,
      note: input.note ?? null,
    })
    return { success: true }
  })

export const deleteRating = createServerFn({ method: 'DELETE' })
  .inputValidator((input: DayInput) => input)
  .handler(async ({ input }) => {
    await db.delete(day_ratings).where(eq(day_ratings.day, input.day))
    return { success: true }
  })

export const exportYear = createServerFn({ method: 'GET' })
  .inputValidator((input: { year: number; format?: 'json' | 'csv' }) => input)
  .handler(async ({ input }) => {
    const rows = await db.query.day_ratings.findMany()
    const filtered = rows.filter((r) => new Date(r.day as any).getFullYear() === input.year)
    if (input.format === 'csv') {
      const header = 'day,rating,note,created_at,updated_at\n'
      const body = filtered
        .map((r) => {
          const day = new Date(r.day as any).toISOString().slice(0, 10)
          const rating = r.rating ?? ''
          const note = (r.note ?? '').replace(/"/g, '""')
          const created = r.createdAt ? new Date(r.createdAt as any).toISOString() : ''
          const updated = r.updatedAt ? new Date(r.updatedAt as any).toISOString() : ''
          return `"${day}","${rating}","${note}","${created}","${updated}"`
        })
        .join('\n')
      return header + body
    }
    return filtered
  })

export default null
