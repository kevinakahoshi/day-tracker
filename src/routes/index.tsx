import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '../components/Dashboard'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Day Tracker</h1>
          <p className="text-gray-600 mt-2">
            Track how you feel about each day of the year
          </p>
        </div>
        <Dashboard />
      </div>
    </div>
  )
}
