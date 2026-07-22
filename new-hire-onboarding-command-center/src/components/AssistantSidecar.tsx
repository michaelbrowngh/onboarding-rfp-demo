import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import type { AssistantContext } from '../domain/onboarding'
import styles from './AssistantSidecar.module.css'

interface AssistantSidecarProps {
  context: AssistantContext
}

export function AssistantSidecar({ context }: AssistantSidecarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<string[]>([
    context.summary,
    `Suggested action: ${context.suggestedActions[0]}`,
  ])

  const panelId = 'assistant-floating-panel'

  const canSend = draft.trim().length > 0

  const helperText = useMemo(
    () =>
      context.suggestedActions
        .slice(0, 2)
        .map((action, index) => `${index + 1}. ${action}`)
        .join(' '),
    [context.suggestedActions],
  )

  const handleSend = () => {
    const prompt = draft.trim()

    if (!prompt) {
      return
    }

    setMessages((current) => [
      ...current,
      `You: ${prompt}`,
      `Assistant: I can help with that. ${helperText}`,
    ])
    setDraft('')
  }

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className={styles.floatingContainer}>
      <button
        type="button"
        className={styles.launcherButton}
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className={styles.iconBubble} aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M4 5.75A2.75 2.75 0 0 1 6.75 3h10.5A2.75 2.75 0 0 1 20 5.75v7.5A2.75 2.75 0 0 1 17.25 16H10l-3.66 3.13A1 1 0 0 1 4.7 18.4V16A2.75 2.75 0 0 1 2 13.25v-7.5Zm4.2 2.35a1 1 0 1 0 0 2h7.6a1 1 0 1 0 0-2H8.2Zm0 3.8a1 1 0 1 0 0 2h4.6a1 1 0 1 0 0-2H8.2Z" />
          </svg>
        </span>
      </button>

      <aside
        id={panelId}
        className={`${styles.sidecar} ${isOpen ? styles.sidecarOpen : styles.sidecarClosed}`}
        aria-label="Assistant sidecar"
      >
        <div className={styles.sidecarHeader}>
          <div className={styles.sidecarIdentity}>
            <span className={styles.brandIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M4 5.75A2.75 2.75 0 0 1 6.75 3h10.5A2.75 2.75 0 0 1 20 5.75v7.5A2.75 2.75 0 0 1 17.25 16H10l-3.66 3.13A1 1 0 0 1 4.7 18.4V16A2.75 2.75 0 0 1 2 13.25v-7.5Zm4.2 2.35a1 1 0 1 0 0 2h7.6a1 1 0 1 0 0-2H8.2Zm0 3.8a1 1 0 1 0 0 2h4.6a1 1 0 1 0 0-2H8.2Z" />
              </svg>
            </span>
            <div>
              <p className={styles.eyebrow}>Onboarding operations assistant</p>
              <h2 className={styles.title}>{context.heading}</h2>
            </div>
          </div>
        </div>

        <section className={styles.chatThread}>
          {messages.map((message) => (
            <p key={message} className={styles.chatBubble}>
              {message}
            </p>
          ))}
        </section>

        <section className={styles.panelMuted}>
          <h3 className={styles.panelTitle}>Prepared options</h3>
          <ul className={styles.actionList}>
            {context.suggestedActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </section>

        <div className={styles.chatComposer}>
          <label className={styles.composerLabel} htmlFor="assistant-chat-input">
            Ask the assistant
          </label>
          <div className={styles.inputRow}>
            <input
              id="assistant-chat-input"
              className={styles.chatInput}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type your question"
            />
            <button
              type="button"
              className={styles.sendButton}
              onClick={handleSend}
              disabled={!canSend}
            >
              Send
            </button>
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  )
}
