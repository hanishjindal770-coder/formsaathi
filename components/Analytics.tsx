/**
 * Cloudflare Web Analytics: free, cookie-less, no personal data. Renders nothing unless
 * NEXT_PUBLIC_CF_ANALYTICS_TOKEN is set at build time.
 */
export default function Analytics() {
  const token = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;
  if (!token) return null;
  return <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={JSON.stringify({ token })} />;
}
