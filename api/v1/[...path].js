export default async function handler(req, res) {
  const segments = req.query.path
  const pathParts = Array.isArray(segments) ? segments : segments ? [segments] : []
  const path = pathParts.join('/')
  const targetUrl = `https://api.poker44.net/api/v1/${path}`

  try {
    const upstream = await fetch(targetUrl, {
      headers: { Accept: 'application/json' },
    })
    const body = await upstream.text()
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
    res.status(upstream.status).send(body)
  } catch (error) {
    res.status(502).json({
      success: false,
      error: {
        code: 'PROXY_ERROR',
        message: error instanceof Error ? error.message : 'Proxy request failed',
      },
    })
  }
}
