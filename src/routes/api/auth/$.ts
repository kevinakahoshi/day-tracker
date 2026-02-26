import { auth } from '#/lib/auth';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        console.log('[auth] incoming GET', request.url)
        return await auth.handler(request)
      },
      POST: async ({ request }) => {
        console.log('[auth] incoming POST', request.url)
        return await auth.handler(request)
      },
    },
  },
});
