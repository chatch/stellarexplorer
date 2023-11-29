class AccountTypeUnrecognizedException extends Error {
  account: string

  constructor(account: string) {
    super(`Unrecognized account type for [${account}]`)
    this.account = account
  }
}

export default AccountTypeUnrecognizedException
