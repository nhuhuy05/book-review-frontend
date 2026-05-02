export function getCurrentPath() {
  return window.location.pathname
}

export function matchPath(pattern, pathname = getCurrentPath()) {
  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = pathname.split('/').filter(Boolean)

  if (patternParts.length !== pathParts.length) {
    return false
  }

  return patternParts.every((part, index) => part.startsWith(':') || part === pathParts[index])
}

export function getRouteParams(pattern, pathname = getCurrentPath()) {
  if (!matchPath(pattern, pathname)) {
    return null
  }

  const patternParts = pattern.split('/').filter(Boolean)
  const pathParts = pathname.split('/').filter(Boolean)

  return patternParts.reduce((params, part, index) => {
    if (part.startsWith(':')) {
      params[part.slice(1)] = pathParts[index]
    }

    return params
  }, {})
}

export function navigate(path) {
  if (window.location.pathname === path) {
    return
  }

  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
