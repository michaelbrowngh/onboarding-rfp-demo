import customerPortalSeedsData from './customerPortalSeeds.json'
import { candidateCases } from './candidateCases'
import type { CustomerPortalModel, CustomerPortalSeed } from '../domain/customerPortal'

const seeds = customerPortalSeedsData as CustomerPortalSeed[]

function slugToName(slug: string) {
  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function resolveOperationsCase(seed: CustomerPortalSeed) {
  const expectedName = slugToName(seed.id)

  return candidateCases.find((candidate) => candidate.candidateName === expectedName)
}

export const customerPortalModels: CustomerPortalModel[] = seeds.reduce<CustomerPortalModel[]>(
  (models, seed) => {
    const operationsCase = resolveOperationsCase(seed)

    if (!operationsCase) {
      return models
    }

    const missingItemsCount = seed.checklist.filter((item) => item.status === 'missing').length

    models.push({
      ...seed,
      operationsContext: {
        severityLabel: operationsCase.severityLabel,
        statusLabel: operationsCase.statusLabel,
        riskReason: operationsCase.riskReason,
        nextStep: operationsCase.nextStep,
        startDateLabel: operationsCase.startDateLabel,
      },
      missingItemsCount,
    })

    return models
  },
  [],
)

export function getCustomerPortalModelById(candidateId: string) {
  return customerPortalModels.find((candidate) => candidate.id === candidateId)
}
