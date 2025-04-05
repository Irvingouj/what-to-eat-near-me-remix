import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type MetaFunction,
} from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./tailwind.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const meta: MetaFunction = () => {
  return [
    { title: "What to Eat Near Me - Find Your Next Meal" },
    { name: "description", content: "Discover great restaurants near you with our smart restaurant finder. Get personalized recommendations based on your location and preferences." },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "robots", content: "index, follow" },
    { name: "theme-color", content: "#DC2626" },
    // Open Graph
    { property: "og:type", content: "website" },
    { property: "og:title", content: "What to Eat Near Me - Find Your Next Meal" },
    { property: "og:description", content: "Discover great restaurants near you with our smart restaurant finder. Get personalized recommendations based on your location and preferences." },
    { property: "og:site_name", content: "What to Eat Near Me" },
    { property: "og:image", content: "/pizza-512x512.png" },
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "What to Eat Near Me - Find Your Next Meal" },
    { name: "twitter:description", content: "Discover great restaurants near you with our smart restaurant finder. Get personalized recommendations based on your location and preferences." },
    { name: "twitter:image", content: "/pizza-512x512.png" },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
