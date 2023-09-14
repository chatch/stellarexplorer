import { LoaderArgs, json } from "@remix-run/node"
import { useLoaderData, useParams } from "@remix-run/react"
import { useEffect } from "react"
import { getContractDecompiled } from "~/lib/stellar/contracts"
import { setTitle } from "~/lib/utils"


const Code = ({ code }: { code: string }) => (
  <pre>{code}</pre>
)

export const loader = ({ params, request }: LoaderArgs) => {
  return getContractDecompiled(`ksjdf`).then((result) => json({ code: result }))
}

export default function CodeTab() {
  const { code } =
    useLoaderData<typeof loader>()

  const { contractId } = useParams()
  useEffect(() => {
    setTitle(`Contract Code ${contractId}`)
  }, [])

  if (!code) {
    return
  }

  return (
    <Code code={code} />
  )
}