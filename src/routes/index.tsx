import { authClient } from '#/lib/auth-client'
import { getSession } from '#/lib/auth.server'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Dashboard } from '../components/Dashboard'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: App,
})

function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex gap-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Day Tracker</h1>
            <p className="text-gray-600 mt-2">
              Track how you feel about each day of the year
            </p>
          </div>
          <button onClick={() => authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                navigate({
                  to: '/login'
                });
              }
            }
          })}>
            Sign Out
          </button>
        </div>
        <Dashboard />
      </div>
    </div>
  )
}
