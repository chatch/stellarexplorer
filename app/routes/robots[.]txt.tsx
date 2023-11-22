export const loader = () => {
  const robotText = `User-agent: *
Disallow:
`
  return new Response(robotText, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
