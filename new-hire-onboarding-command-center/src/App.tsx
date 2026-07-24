import { CommandCenterPage } from './app/CommandCenterPage'
import { CandidatePortalPage } from './app/CandidatePortalPage'
import { getCustomerPortalModelById } from './data/customerPortalData'

function getRouteState(pathname: string) {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'
  const routeParts = normalizedPath.split('/').filter(Boolean)

  if (routeParts[0] === 'portal' && routeParts[1]) {
    return { type: 'portal' as const, candidateId: routeParts[1] }
  }

  return { type: 'operations' as const }
}

function App() {
  const routeState = getRouteState(window.location.pathname)

  if (routeState.type === 'portal') {
    const portalModel = getCustomerPortalModelById(routeState.candidateId)

    if (portalModel) {
      return <CandidatePortalPage model={portalModel} />
    }

    return <CommandCenterPage />
  }

  return <CommandCenterPage />
}

export default App
