import { createClient } from "@base44/sdk";

export const base44 = createClient({
  appId: "699f791c6833e0f9b308cc1d",
  headers: {
    api_key: import.meta.env.VITE_BASE44_API_KEY
  },
  serverUrl: "https://auradia-calm-space.base44.app",
  requiresAuth: true
});