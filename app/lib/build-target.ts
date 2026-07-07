type BuildTarget = 'centralized' | 'decentralized'

declare const __STEEXP_BUILD_TARGET__: BuildTarget | undefined

const buildTarget: BuildTarget =
  typeof __STEEXP_BUILD_TARGET__ === 'string'
    ? __STEEXP_BUILD_TARGET__
    : 'centralized'

const isDecentralizedBuild = buildTarget === 'decentralized'

const publicAssetUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path

  if (isDecentralizedBuild && typeof window !== 'undefined') {
    return new URL(normalizedPath, `${window.location.origin}/`).toString()
  }

  if (isDecentralizedBuild) {
    return `./${normalizedPath}`
  }

  return `/${normalizedPath}`
}

export { buildTarget, isDecentralizedBuild, publicAssetUrl }
