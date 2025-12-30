import { postgres } from "vite-plugin-db";

// export default postgresPlugin({
//   seed: {
//     type: 'sql-script',
//     path: 'db/init.sql',
//   },
//   referrer: 'create-tanstack',
//   dotEnvKey: 'VITE_DATABASE_URL',
// })

export default postgres({
	referrer: "day-tracker",
	env: ".env.local", // Path to your .env file (default: ".env")
	envKey: "DATABASE_URL", // Name of the env variable (default: "DATABASE_URL")
	envPrefix: "VITE_", // Prefix for public env vars (default: "VITE_")
	seed: {
		type: "sql-script",
		path: "./schema.sql", // Path to SQL file to execute after database creation
	},
});
