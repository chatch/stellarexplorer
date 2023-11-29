// learn more: https://fly.io/docs/reference/configuration/#services-http_checks

export const loader = async () => {
  return new Response('OK')
}
