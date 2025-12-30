Vercel deployment — run Drizzle migrations during build

When deploying to Vercel, ensure your `DATABASE_URL` environment variable is configured in the Project Settings. Run migrations as part of the build step so your production database has the latest schema.

Build command (set in Vercel):

```bash
npm run migrate && npm run build
```

The `migrate` script added to `package.json` runs `drizzle-kit` using the `DATABASE_URL` environment variable. Example env values to set in Vercel: `DATABASE_URL` (production Postgres/Neon connection string).

If you'd prefer automatic generation, you can also run `npx drizzle-kit generate` locally and check in the resulting SQL migrations.
