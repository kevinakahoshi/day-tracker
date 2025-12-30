const fs = require('fs')
const path = require('path')
const { Client } = require('pg')

function getDatabaseUrl() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) return process.env.DATABASE_URL
  const content = fs.readFileSync(envPath, 'utf8')
  const m = content.match(/^DATABASE_URL=\"?(.*)\"?$/m)
  return (m && m[1]) || process.env.DATABASE_URL
}

async function main() {
  const databaseUrl = getDatabaseUrl()
  if (!databaseUrl) {
    console.error('DATABASE_URL not found in .env.local or env')
    process.exit(2)
  }
  const client = new Client({ connectionString: databaseUrl })
  try {
    await client.connect()
    const res = await client.query(`SELECT EXISTS (
      SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='day_ratings'
    ) AS exists`)
    const exists = res.rows[0].exists
    console.log('day_ratings_exists:', exists)
    if (exists) {
      const cols = await client.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name='day_ratings' ORDER BY ordinal_position`)
      console.log('columns:')
      for (const r of cols.rows) console.log(` - ${r.column_name}: ${r.data_type}`)
    }
    await client.end()
    process.exit(0)
  } catch (err) {
    console.error('Error checking table:', err.message || err)
    try { await client.end() } catch (e) {}
    process.exit(3)
  }
}

main()
