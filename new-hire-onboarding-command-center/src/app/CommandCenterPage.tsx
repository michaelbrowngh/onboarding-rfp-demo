import { candidateCases } from '../data/candidateCases'
import {
  DEMO_LAST_REFRESH_LABEL,
  DEMO_REPORTING_PERIOD,
} from '../data/demoDate'
import { kpiSnapshots } from '../data/kpiSnapshots'
import type { AssistantContext, CandidateCase } from '../domain/onboarding'
import { AiKpiSummary } from '../components/AiKpiSummary'
import { AssistantSidecar } from '../components/AssistantSidecar'
import { CandidateSection } from '../components/CandidateSection'
import { HeaderBar } from '../components/HeaderBar'
import { KpiBand } from '../components/KpiBand'
import styles from './CommandCenterPage.module.css'
import { summarizeKpiRisk } from '../utils/riskRules'

const queueDescriptions = {
  critical:
    'Blocking prerequisites or expiring SLA windows that need intervention before the next handoff.',
  'action-required':
    'Cases waiting on operations judgment, manager approval, or curated outbound communication.',
  warning:
    'Signals that deserve monitoring before they escalate into a blocked start-date commitment.',
} as const

const assistantContext: AssistantContext = {
  heading: 'Assistant readiness snapshot',
  status: 'Synthetic context loaded',
  summary:
    'Joe Brown and Aisha Khan are driving immediate risk. The top pattern is initiation work that missed an ownership handoff during preboarding, followed by one contract case with a start date inside the critical threshold.',
  suggestedActions: [
    'Explain root-cause drivers for the two critical cases.',
    'Compare whether Joe Brown should keep the current start date.',
    'Draft a clarification email for Elena Petrova and recruiting.',
  ],
  guardrailNote:
    'This sidecar is a static prototype shell in Phase 1. No prompts are sent and no system writes occur.',
}

function filterCandidates(queue: CandidateCase['queueCategory']) {
  return candidateCases.filter((candidate) => candidate.queueCategory === queue)
}

export function CommandCenterPage() {
  const criticalCases = filterCandidates('critical')
  const actionRequiredCases = filterCandidates('action-required')
  const warningCases = filterCandidates('warning')
  const riskSummary = summarizeKpiRisk(kpiSnapshots)

  return (
    <main className={styles.pageShell}>
      <div className={styles.backdrop}>
        <section className={styles.commandCenterColumn}>
          <HeaderBar
            lastRefreshLabel={DEMO_LAST_REFRESH_LABEL}
            reportingPeriod={DEMO_REPORTING_PERIOD}
          />

          <KpiBand
            kpis={kpiSnapshots}
            atRiskCount={riskSummary.atRisk}
            projectedMissCount={riskSummary.projectedMiss}
          />

          <AiKpiSummary summary="12 candidates are approaching an SLA threshold. Background-check initiation is the largest current risk, driven by six cases waiting on candidate data and three stale CRM assignments." />

          <div className={styles.sections}>
            <CandidateSection
              title="Candidates - Critical"
              description={queueDescriptions.critical}
              candidates={criticalCases}
            />
            <CandidateSection
              title="Candidates - Action Required"
              description={queueDescriptions['action-required']}
              candidates={actionRequiredCases}
            />
            <CandidateSection
              title="Candidates - Warning / Flags"
              description={queueDescriptions.warning}
              candidates={warningCases}
            />
          </div>
        </section>

        <AssistantSidecar context={assistantContext} />
      </div>
    </main>
  )
}
