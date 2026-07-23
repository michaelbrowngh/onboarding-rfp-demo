import { useRef, useState } from 'react'
import { candidateCases } from '../data/candidateCases'
import {
  DEMO_LAST_REFRESH_LABEL,
} from '../data/demoDate'
import { kpiSnapshots } from '../data/kpiSnapshots'
import type { AssistantContext, CandidateCase } from '../domain/onboarding'
import { AssistantSidecar } from '../components/AssistantSidecar'
import { CandidateSection } from '../components/CandidateSection'
import { HeaderBar } from '../components/HeaderBar'
import KpiRail from '../components/KpiRail'
import styles from './CommandCenterPage.module.css'

const AI_KPI_SUMMARY =
  '9 candidates are approaching an SLA threshold. Background-check initiation is the largest current risk, with 2 cases near the 24h window and 1 projected miss.'

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
  status: '',
  summary:
    'Joe Brown and Aisha Khan are driving immediate risk. The top pattern is initiation work that missed an ownership handoff during preboarding, followed by one contract case with a start date inside the critical threshold.',
  suggestedActions: [
    'Explain root-cause drivers for the two critical cases.',
    'Compare whether Joe Brown should keep the current start date.',
    'Draft a clarification email for Elena Petrova and recruiting.',
  ],
  guardrailNote: '',
}

function filterCandidates(queue: CandidateCase['queueCategory']) {
  return candidateCases.filter((candidate) => candidate.queueCategory === queue)
}

export function CommandCenterPage() {
  const [sidecarOpen, setSidecarOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateCase | undefined>(undefined)
  const [pendingAction, setPendingAction] = useState<
    { candidateId: string; mode: 'ai-action' | 'ai-review'; requestId: number } | undefined
  >(undefined)
  const [completionBanner, setCompletionBanner] = useState<string | undefined>(undefined)
  const requestIdRef = useRef(0)

  const criticalCases = filterCandidates('critical')
  const actionRequiredCases = filterCandidates('action-required')
  const warningCases = filterCandidates('warning')

  const handleCandidateAction = (candidate: CandidateCase, mode: 'ai-action' | 'ai-review') => {
    requestIdRef.current += 1
    setSelectedCandidate(candidate)
    setSidecarOpen(true)
    setPendingAction({ candidateId: candidate.id, mode, requestId: requestIdRef.current })
  }

  const handleAutomationComplete = (candidate: CandidateCase) => {
    setCompletionBanner(`${candidate.candidateName}: ${candidate.actionDetail}`)
  }

  const handleBackToGeneral = () => {
    setSelectedCandidate(undefined)
  }

  return (
    <main className={styles.pageShell}>
      {completionBanner && (
        <div className={styles.completionBanner} role="status">
          <span className={styles.completionBannerIcon} aria-hidden="true">
            ✓
          </span>
          <span className={styles.completionBannerText}>{completionBanner}</span>
          <button
            type="button"
            className={styles.completionBannerClose}
            onClick={() => setCompletionBanner(undefined)}
            aria-label="Dismiss confirmation"
          >
            ×
          </button>
        </div>
      )}
      <div className={styles.backdrop}>
        <div className={`${styles.layout} ${sidecarOpen ? styles.layoutSidecarOpen : ''}`}>
          {/* Column 1: KPI Rail */}
          <KpiRail
            kpis={kpiSnapshots}
            summary={AI_KPI_SUMMARY}
          />

          {/* Column 2: Main content */}
          <div className={styles.mainColumn}>
            <HeaderBar
              lastRefreshLabel={DEMO_LAST_REFRESH_LABEL}
            />
            <div className={styles.sectionsScroll}>
              <CandidateSection
                title="Candidates - Critical"
                description={queueDescriptions.critical}
                candidates={criticalCases}
                onCandidateAction={handleCandidateAction}
                onAutomationComplete={handleAutomationComplete}
              />
              <CandidateSection
                title="Candidates - Action Required"
                description={queueDescriptions['action-required']}
                candidates={actionRequiredCases}
                onCandidateAction={handleCandidateAction}
                onAutomationComplete={handleAutomationComplete}
              />
              <CandidateSection
                title="Candidates - Warning / Flags"
                description={queueDescriptions.warning}
                candidates={warningCases}
                onCandidateAction={handleCandidateAction}
                onAutomationComplete={handleAutomationComplete}
              />
            </div>
          </div>

          {/* Column 3: Assistant Sidecar */}
          <div className={styles.sidecarColumn}>
            <AssistantSidecar
              context={assistantContext}
              isOpen={sidecarOpen}
              onToggle={() => setSidecarOpen((p) => !p)}
              selectedCandidate={selectedCandidate}
              onBackToGeneral={handleBackToGeneral}
              pendingAction={pendingAction}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
