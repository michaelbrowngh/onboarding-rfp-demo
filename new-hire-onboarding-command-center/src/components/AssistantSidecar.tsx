import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { AssistantContext, CandidateCase, FollowUpStep } from '../domain/onboarding'
import {
  getMockGeneralChatResponse,
  getMockCandidateResponse,
  getFollowUpCompletionResponse,
  getInitialFollowUpSteps,
  buildCandidateReviewPrompt,
} from '../utils/agentResponses'
import styles from './AssistantSidecar.module.css'

interface AssistantSidecarProps {
  context: AssistantContext
  isOpen: boolean
  onToggle: () => void
  selectedCandidate?: CandidateCase
  onBackToGeneral?: () => void
  pendingAction?: { candidateId: string; mode: 'ai-action' | 'ai-review'; requestId: number }
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
}

interface DraftReview {
  messageId: string
  sendStepId: string
  text: string
  mode: 'review' | 'editing'
}

let messageIdCounter = 0
function nextMessageId() {
  messageIdCounter += 1
  return `msg-${messageIdCounter}`
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Renders a small subset of markdown (bold, bullet/numbered lists, pipe tables) so agent
// responses can present structured information without pulling in a markdown dependency.
function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

// Renders freeform text (e.g. an email draft) with bold formatting and preserved line breaks,
// without the block-level list/table parsing used for chat responses.
function renderFormattedLines(text: string): ReactNode[] {
  return text.split('\n').map((line, index) => (
    <span key={index}>
      {renderInline(line)}
      {index < text.split('\n').length - 1 && <br />}
    </span>
  ))
}

function FormattedMessage({ text }: { text: string }) {
  const lines = text.split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0

  const isTableSeparator = (line?: string) => !!line && /^\s*\|?\s*-{2,}/.test(line)
  const isBullet = (line: string) => /^\s*[-*]\s+/.test(line)
  const isNumbered = (line: string) => /^\s*\d+\.\s+/.test(line)

  while (i < lines.length) {
    const line = lines[i]

    if (line.trim() === '') {
      i++
      continue
    }

    if (line.includes('|') && isTableSeparator(lines[i + 1])) {
      const headerCells = line.split('|').map((cell) => cell.trim()).filter(Boolean)
      const rows: string[][] = []
      let j = i + 2
      while (j < lines.length && lines[j].includes('|')) {
        rows.push(lines[j].split('|').map((cell) => cell.trim()).filter(Boolean))
        j++
      }
      blocks.push(
        <table key={key++} className={styles.fmTable}>
          <thead>
            <tr>
              {headerCells.map((cell, idx) => (
                <th key={idx}>{renderInline(cell)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx}>{renderInline(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )
      i = j
      continue
    }

    if (isBullet(line)) {
      const items: string[] = []
      let j = i
      while (j < lines.length && isBullet(lines[j])) {
        items.push(lines[j].replace(/^\s*[-*]\s+/, ''))
        j++
      }
      blocks.push(
        <ul key={key++} className={styles.fmList}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      )
      i = j
      continue
    }

    if (isNumbered(line)) {
      const items: string[] = []
      let j = i
      while (j < lines.length && isNumbered(lines[j])) {
        items.push(lines[j].replace(/^\s*\d+\.\s+/, ''))
        j++
      }
      blocks.push(
        <ol key={key++} className={styles.fmList}>
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>
      )
      i = j
      continue
    }

    const paraLines: string[] = []
    let j = i
    while (
      j < lines.length &&
      lines[j].trim() !== '' &&
      !isBullet(lines[j]) &&
      !isNumbered(lines[j]) &&
      !(lines[j].includes('|') && isTableSeparator(lines[j + 1]))
    ) {
      paraLines.push(lines[j])
      j++
    }
    blocks.push(
      <p key={key++} className={styles.fmParagraph}>
        {renderInline(paraLines.join(' '))}
      </p>
    )
    i = j
  }

  return <>{blocks}</>
}

export function AssistantSidecar({
  isOpen,
  onToggle,
  selectedCandidate,
  onBackToGeneral,
  pendingAction,
}: AssistantSidecarProps) {
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [followUpSteps, setFollowUpSteps] = useState<FollowUpStep[]>([])
  const [draftReview, setDraftReview] = useState<DraftReview | undefined>(undefined)
  const [reviewPromptPending, setReviewPromptPending] = useState(false)
  const [progressCollapsed, setProgressCollapsed] = useState(false)

  const chatMode = selectedCandidate ? 'candidate-specific' : 'general'

  const panelId = 'assistant-floating-panel'

  const canSend = draft.trim().length > 0

  const pushMessage = (role: ChatMessage['role'], text: string) => {
    const id = nextMessageId()
    setMessages((current) => [...current, { id, role, text }])
    return id
  }

  const handleClearChat = () => {
    setMessages([])
    setFollowUpSteps([])
    setDraftReview(undefined)
    setReviewPromptPending(false)
    setProgressCollapsed(false)
  }

  // Starting a new candidate-specific conversation (or returning to general) begins with a clean slate.
  useEffect(() => {
    setMessages([])
    setFollowUpSteps([])
    setDraftReview(undefined)
    setReviewPromptPending(false)
    setProgressCollapsed(false)
  }, [selectedCandidate?.id])

  // Once every follow-up step finishes, auto-collapse the progress list down to its header.
  useEffect(() => {
    if (followUpSteps.length > 0 && followUpSteps.every((step) => step.status === 'completed')) {
      setProgressCollapsed(true)
    }
  }, [followUpSteps])

  const executeFollowUpAction = async () => {
    if (!selectedCandidate) return

    const steps = getInitialFollowUpSteps(selectedCandidate)
    setFollowUpSteps(steps)

    const draftStep = steps.find((step) => step.draftEmail)

    if (draftStep) {
      // Animate the drafting step, then hand the draft to the user in-chat for approval.
      await delay(700)
      setFollowUpSteps((current) =>
        current.map((step) => (step.id === draftStep.id ? { ...step, status: 'executing' as const } : step))
      )
      await delay(900)
      setFollowUpSteps((current) =>
        current.map((step) =>
          step.id === draftStep.id ? { ...step, status: 'completed' as const, completedAt: new Date() } : step
        )
      )

      const sendStep = steps.find((step) => step.id !== draftStep.id)
      const messageId = pushMessage('assistant', draftStep.draftEmail!)
      setDraftReview({ messageId, sendStepId: sendStep?.id ?? '', text: draftStep.draftEmail!, mode: 'review' })
      return
    }

    // Non-draft flows (e.g., multi-system updates) run straight through.
    for (let i = 0; i < steps.length; i++) {
      await delay(800)
      setFollowUpSteps((current) =>
        current.map((step, idx) =>
          idx === i
            ? { ...step, status: 'executing' as const }
            : idx < i
              ? { ...step, status: 'completed' as const, completedAt: new Date() }
              : step
        )
      )

      await delay(1200)
      setFollowUpSteps((current) =>
        current.map((step, idx) =>
          idx === i ? { ...step, status: 'completed' as const, completedAt: new Date() } : step
        )
      )
    }

    const actionType = steps.length === 2 ? 'email' : 'date-change'
    const completion = getFollowUpCompletionResponse(selectedCandidate, actionType)
    await delay(completion.delayMs)
    pushMessage('assistant', completion.text)
  }

  const handleAcceptDraft = async () => {
    if (!draftReview || !selectedCandidate) return
    const sendStepId = draftReview.sendStepId
    setDraftReview(undefined)

    if (sendStepId) {
      setFollowUpSteps((current) =>
        current.map((step) => (step.id === sendStepId ? { ...step, status: 'executing' as const } : step))
      )
      await delay(900)
      setFollowUpSteps((current) =>
        current.map((step) =>
          step.id === sendStepId ? { ...step, status: 'completed' as const, completedAt: new Date() } : step
        )
      )
    }

    const completion = getFollowUpCompletionResponse(selectedCandidate, 'email')
    await delay(completion.delayMs)
    pushMessage('assistant', completion.text)
  }

  const handleEditDraft = () => {
    setDraftReview((current) => (current ? { ...current, mode: 'editing' } : current))
  }

  const handleCancelEditDraft = () => {
    setDraftReview((current) => (current ? { ...current, mode: 'review' } : current))
  }

  const handleSaveDraft = async () => {
    if (!draftReview) return
    const { messageId, text } = draftReview
    setMessages((current) => current.map((message) => (message.id === messageId ? { ...message, text } : message)))
    setDraftReview((current) => (current ? { ...current, mode: 'review' } : current))
    await handleAcceptDraft()
  }

  const handleSend = () => {
    const prompt = draft.trim()

    if (!prompt) {
      return
    }

    // A pre-created "Review with AI" prompt should always get a real reply once sent,
    // even though free-typed follow-up messages don't auto-respond.
    if (reviewPromptPending) {
      setReviewPromptPending(false)
      void handleSuggestedPrompt(prompt)
      return
    }

    pushMessage('user', prompt)
    setDraft('')
  }

  const handleSuggestedPrompt = async (promptText: string) => {
    setDraft('')
    // Add user message
    pushMessage('user', promptText)

    // Get mock response with delay
    let response: { text: string; delayMs: number }
    if (chatMode === 'candidate-specific' && selectedCandidate) {
      response = getMockCandidateResponse(selectedCandidate, promptText)

      // Start follow-up action if requested
      if (promptText.toLowerCase().includes('follow-up')) {
        await delay(response.delayMs)
        pushMessage('assistant', response.text)
        await executeFollowUpAction()
        return
      }
    } else {
      response = getMockGeneralChatResponse(promptText)
    }

    await delay(response.delayMs)
    pushMessage('assistant', response.text)
  }

  // Handle a pending action button click ("Take Action with AI" auto-submits the follow-up
  // prompt; "Review with AI" seeds the composer with a draft prompt for the user to send).
  useEffect(() => {
    if (!selectedCandidate || !pendingAction || pendingAction.candidateId !== selectedCandidate.id) {
      return
    }

    if (pendingAction.mode === 'ai-action') {
      void handleSuggestedPrompt(`Please take next follow-up action for candidate ${selectedCandidate.candidateName}.`)
    } else if (pendingAction.mode === 'ai-review') {
      setDraft(buildCandidateReviewPrompt(selectedCandidate))
      setReviewPromptPending(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAction?.requestId])

  return (
    <div className={styles.sidecarColumn}>
      {!isOpen && (
        <button
          type="button"
          className={`${styles.launcherButton} ${styles.launcherFixed}`}
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label="Open assistant"
          onClick={onToggle}
        >
          <span className={styles.iconBubble} aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path
                d="M12 3.5c-4.7 0-8.5 3.24-8.5 7.25 0 2.3 1.24 4.36 3.22 5.7-.14.98-.5 2-1.13 3.02a.5.5 0 0 0 .58.74c1.62-.44 2.96-1.08 3.96-1.7.9.2 1.85.3 2.87.3 4.7 0 8.5-3.24 8.5-7.25S16.7 3.5 12 3.5Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M15.3 7.4l.55 1.35 1.35.55-1.35.55-.55 1.35-.55-1.35-1.35-.55 1.35-.55.55-1.35Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </button>
      )}

      <aside
        id={panelId}
        className={`${styles.sidecar} ${isOpen ? styles.sidecarOpen : styles.sidecarClosed}`}
        aria-label="Assistant sidecar"
      >
        <div className={styles.sidecarHeader}>
          <div className={styles.sidecarHeaderTop}>
            <div className={styles.headerTitleGroup}>
              <h2 className={styles.title}>Onboarding Operations Assistant</h2>
              {chatMode === 'candidate-specific' && selectedCandidate && (
                <p className={styles.candidateSubtitle}>Candidate: {selectedCandidate.candidateName}</p>
              )}
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onToggle}
              aria-label="Close assistant"
            >
              ×
            </button>
          </div>
          {(chatMode === 'candidate-specific' || messages.length > 0) && (
            <div className={styles.headerActionsRow}>
              {chatMode === 'candidate-specific' ? (
                <button
                  type="button"
                  className={styles.backLink}
                  onClick={onBackToGeneral}
                  aria-label="Back to general chat"
                >
                  ← Back to general chat
                </button>
              ) : (
                <span />
              )}
              {messages.length > 0 && (
                <button type="button" className={styles.clearButton} onClick={handleClearChat}>
                  Clear chat
                </button>
              )}
            </div>
          )}
        </div>

        <div className={styles.scrollArea}>
        <section className={styles.chatThread}>
          {messages.map((message) => {
            if (draftReview && message.id === draftReview.messageId) {
              return (
                <div
                  key={message.id}
                  className={`${styles.chatBubble} ${styles.chatBubbleAssistant} ${styles.draftCard}`}
                >
                  <p className={styles.draftCardLabel}>Draft email</p>
                  {draftReview.mode === 'review' ? (
                    <>
                      <div className={styles.draftEmail}>{renderFormattedLines(draftReview.text)}</div>
                      <div className={styles.draftActions}>
                        <button
                          type="button"
                          className={styles.draftAcceptButton}
                          onClick={() => void handleAcceptDraft()}
                        >
                          Accept
                        </button>
                        <button type="button" className={styles.draftEditButton} onClick={handleEditDraft}>
                          Edit
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <textarea
                        className={styles.draftEditArea}
                        value={draftReview.text}
                        spellCheck={false}
                        onChange={(event) =>
                          setDraftReview((current) => (current ? { ...current, text: event.target.value } : current))
                        }
                      />
                      <div className={styles.draftActions}>
                        <button
                          type="button"
                          className={styles.draftAcceptButton}
                          onClick={() => void handleSaveDraft()}
                        >
                          Save &amp; Send
                        </button>
                        <button type="button" className={styles.draftCancelButton} onClick={handleCancelEditDraft}>
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )
            }

            return (
              <div
                key={message.id}
                className={`${styles.chatBubble} ${
                  message.role === 'user' ? styles.chatBubbleUser : styles.chatBubbleAssistant
                }`}
              >
                <FormattedMessage text={message.text} />
              </div>
            )
          })}
        </section>
        </div>

        {followUpSteps.length > 0 && (
          <section className={styles.followUpActions}>
            <div className={styles.followUpHeader}>
              <button
                type="button"
                className={`${styles.followUpCaretButton} ${progressCollapsed ? styles.followUpCaretCollapsed : ''}`}
                onClick={() => setProgressCollapsed((collapsed) => !collapsed)}
                aria-expanded={!progressCollapsed}
                aria-label={progressCollapsed ? 'Expand follow-up progress' : 'Collapse follow-up progress'}
              >
                <svg viewBox="0 0 12 8" focusable="false" className={styles.followUpCaretIcon}>
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </button>
              <span className={styles.followUpTitle}>Follow-up action progress</span>
            </div>
            {!progressCollapsed && (
              <div className={styles.stepsList}>
                {followUpSteps.map((step) => (
                  <div key={step.id} className={`${styles.step} ${styles[`step-${step.status}`]}`}>
                    <span className={styles.stepIcon}>
                      {step.status === 'completed' ? '✅' : step.status === 'executing' ? '🔄' : '⭕'}
                    </span>
                    <span className={styles.stepLabel}>{step.label}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {messages.length === 0 && chatMode === 'general' && (
          <section className={styles.suggestedPrompts}>
            <button
              type="button"
              className={styles.promptButton}
              onClick={() => handleSuggestedPrompt('Show me the candidates in critical status.')}
            >
              Show me the candidates in critical status.
            </button>
            <button
              type="button"
              className={styles.promptButton}
              onClick={() => handleSuggestedPrompt('Which KPIs have the largest projected misses this month?')}
            >
              Which KPIs have the largest projected misses this month?
            </button>
            <button
              type="button"
              className={styles.promptButton}
              onClick={() => handleSuggestedPrompt('What actions are pending from my side?')}
            >
              What actions are pending from my side?
            </button>
          </section>
        )}

        {messages.length === 0 && chatMode === 'candidate-specific' && selectedCandidate && (
          <section className={styles.suggestedPrompts}>
            <button
              type="button"
              className={styles.promptButton}
              onClick={() => handleSuggestedPrompt(`Summarize candidate ${selectedCandidate.candidateName}'s status and identify next steps.`)}
            >
              Summarize candidate status
            </button>
            <button
              type="button"
              className={styles.promptButton}
              onClick={() => handleSuggestedPrompt(`Please take next follow-up action for candidate ${selectedCandidate.candidateName}.`)}
            >
              Take follow-up action
            </button>
          </section>
        )}

        <div className={styles.chatComposer}>
          <div className={styles.inputRow}>
            <textarea
              id="assistant-chat-input"
              className={styles.chatInput}
              value={draft}
              spellCheck={false}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type your question"
              rows={1}
            />
            <button
              type="button"
              className={styles.sendButton}
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Send"
            >
              <svg viewBox="0 0 24 24" focusable="false" className={styles.sendIcon}>
                <path
                  d="M3.4 11.3L20.1 3.3C20.9 2.9 21.7 3.75 21.3 4.55L14 20.5C13.65 21.25 12.6 21.25 12.25 20.5L9.5 14.5L3.5 12.6C2.75 12.35 2.7 11.65 3.4 11.3Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
