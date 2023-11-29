class ContractIdInvalid extends Error {
  contractId: string

  constructor(contractId: string) {
    super(`Invalid contract id given [${contractId}]`)
    this.contractId = contractId
  }
}

export default ContractIdInvalid
