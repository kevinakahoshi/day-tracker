import { Button } from '#/components/ui/button'
import { authClient } from '#/lib/auth-client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format, isAfter, parseISO, startOfDay } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { ContributionGrid } from './ContributionGrid'
import { EntryForm } from './EntryForm'
import { EntryModal } from './EntryModal'

type DailyEntry = {
  id: number
  userId: string
  entryDate: string
  rating: number
  note: string | null
  createdAt: Date
  updatedAt: Date
}

export const Dashboard = () => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | undefined>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  // Check if user is logged in
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      return await authClient.getSession()
    },
  })

  // Fetch entries for the year
  const { data: entries = [], isLoading: isEntriesLoading } = useQuery({
    queryKey: ['entries', year],
    queryFn: async () => {
      const response = await fetch(`/api/entries/${year}`)
      if (!response.ok) throw new Error('Failed to fetch entries')
      return response.json()
    },
    enabled: !!session,
  })

  // Mutation for saving entry
  const saveEntryMutation = useMutation({
    mutationFn: async (data: { entryDate: string; rating: number; note?: string }) => {
      // Validate that the date is not in the future
      const selectedDay = startOfDay(parseISO(data.entryDate))
      if (isAfter(selectedDay, startOfDay(new Date()))) {
        throw new Error('You cannot enter future dates')
      }

      const response = await fetch('/api/new-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save entry')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entries', year] })
      setIsModalOpen(false)
      setSelectedDate(undefined)
    },
  })

  // Note: Delete functionality can be added later if needed

  const handleDayClick = (date: string) => {
    // Check if date is in the past or today
    const selectedDay = startOfDay(parseISO(date))
    const currentDay = startOfDay(new Date())

    if (isAfter(selectedDay, currentDay)) {
      return // Ignore future dates
    }

    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (data: { entryDate: string; rating: number; note?: string }) => {
    await saveEntryMutation.mutateAsync(data)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedDate(undefined)
  }

  const currentEntry = selectedDate ? entries.find((e: DailyEntry) => e.entryDate === selectedDate) : undefined

  if (isSessionLoading) {
    return <div className="p-8 text-center">Loading session...</div>
  }

  if (!session) {
    return (
      <div className="p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold">Please sign in to continue</h1>
        <p className="text-gray-600">You need to be logged in to use the day tracker</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Year Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setYear(year - 1)}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Year
        </Button>
        <h1 className="text-3xl font-bold">{year}</h1>
        <Button
          variant="outline"
          onClick={() => setYear(year + 1)}
          disabled={year >= new Date().getFullYear()}
          className="gap-2"
        >
          Next Year
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Grid */}
      {isEntriesLoading ? (
        <div className="text-center py-8">Loading entries...</div>
      ) : (
        <ContributionGrid
          year={year}
          entries={entries}
          onDayClick={handleDayClick}
          selectedDate={selectedDate}
        />
      )}

      {/* Modal */}
      <EntryModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={selectedDate ? `Entry for ${format(parseISO(selectedDate), 'MMMM d, yyyy')}` : 'New Entry'}
      >
        <EntryForm
          date={selectedDate}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          initialEntry={currentEntry}
          isLoading={saveEntryMutation.isPending}
        />
      </EntryModal>

      {/* Info message */}
      <div className="text-sm text-gray-600 text-center">
        <p>You can only enter entries for today or dates in the past.</p>
      </div>
    </div>
  )
}
