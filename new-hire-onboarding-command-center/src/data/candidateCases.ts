import candidateSeedsData from './candidateCases.json'
import type { CandidateCase } from '../domain/onboarding'
import { classifyCandidateCase } from '../utils/riskRules'

type CandidateSeed = Omit<CandidateCase, 'queueCategory'>

const candidateSeeds = candidateSeedsData as CandidateSeed[]

export const candidateCases: CandidateCase[] = candidateSeeds.map((candidate) => ({
  ...candidate,
  queueCategory: classifyCandidateCase(candidate as CandidateCase),
}))
