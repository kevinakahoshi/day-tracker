import {
	HeadContent,
	Scripts,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import Header from "../components/Header";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import StoreDevtools from "../lib/demo-store-devtools";

import appCss from "../styles.css?url";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	notFoundComponent: NotFound,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<Header />
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
						StoreDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

function NotFound() {
	return (
		<div style={{ padding: 24 }}>
			<h1>Page Not Found</h1>
			<p>
				The requested page wasn't found. If you intended to open the Day Tracker,
				try <a href="/day/2026">/day/2026</a> (opens a static fallback if the
				dev server isn't fully wired).
			</p>
			<p>
				If the dev server is running, try restarting it: <code>npm run dev</code>
			</p>
		</div>
	);
}
