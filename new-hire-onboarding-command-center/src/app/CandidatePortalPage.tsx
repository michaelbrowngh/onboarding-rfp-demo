import { useState } from 'react'
import {
  AlertCircle,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronRight,
  Circle,
  CircleCheck,
  CircleHelp,
  Clock3,
  ClipboardList,
  FileText,
  FileWarning,
  GraduationCap,
  Mail,
  MessagesSquare,
  Paperclip,
  RefreshCw,
  Send,
  Sparkles,
} from 'lucide-react'
import type { ChatSeedMessage, CustomerPortalModel } from '../domain/customerPortal'
import styles from './CandidatePortalPage.module.css'

interface CandidatePortalPageProps {
  model: CustomerPortalModel
}

interface ChatMessage extends ChatSeedMessage {
  id: string
}

const checklistStatusLabel = {
  missing: 'Missing',
  'in-progress': 'In Progress',
  completed: 'Completed',
} as const

const taskStatusLabel = {
  overdue: 'Overdue',
  'due-soon': 'Due Soon',
  upcoming: 'Upcoming',
} as const

const quickLinkIconMap = {
  'My Checklist': ClipboardList,
  Documents: FileText,
  'Company Information': Building2,
  'Training & Resources': GraduationCap,
  'Frequently Asked Questions': CircleHelp,
} as const

function normalizeForMatch(text: string) {
  return text.trim().toLowerCase()
}

function findResponse(input: string, model: CustomerPortalModel) {
  const normalized = normalizeForMatch(input)

  const matchedRule = model.chatIntentRules.find((rule) =>
    rule.keywords.some((keyword) => normalized.includes(keyword)),
  )

  if (matchedRule) {
    return matchedRule.response
  }

  return `You're currently marked ${model.operationsContext.severityLabel} in operations. Top blocker: ${model.operationsContext.statusLabel}. Next step: ${model.operationsContext.nextStep}`
}

export function CandidatePortalPage({ model }: CandidatePortalPageProps) {
  const [draft, setDraft] = useState('')
  const [supportAvatarAvailable, setSupportAvatarAvailable] = useState(
    Boolean(model.supportContact.avatarPath),
  )
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    model.chatSeedMessages.map((message, index) => ({
      ...message,
      id: `${message.author}-${index}`,
    })),
  )

  const canSend = draft.trim().length > 0

  const completionPercent = Math.max(0, Math.min(100, model.completionPercent))

  const handleSend = () => {
    const prompt = draft.trim()

    if (!prompt) {
      return
    }

    const reply = findResponse(prompt, model)
    const baseId = Date.now().toString()

    setMessages((current) => [
      ...current,
      { id: `${baseId}-user`, author: 'user', text: prompt, timeLabel: 'Now' },
      { id: `${baseId}-assistant`, author: 'assistant', text: reply, timeLabel: 'Now' },
    ])
    setDraft('')
  }

  const supportInitials = model.supportContact.name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.leftRail} aria-label="Onboarding summary">
          <section className={styles.card}>
            <h2 className={styles.railTitle}>Onboarding Summary</h2>
            <div className={styles.progressRow}>
              <div
                className={styles.progressRing}
                aria-label={`${model.completionPercent}% complete`}
                style={{ ['--completion' as string]: `${completionPercent}%` }}
              >
                <div className={styles.progressRingInner}>
                  <span className={styles.progressValue}>{model.completionPercent}%</span>
                  <span className={styles.progressCaption}>Complete</span>
                </div>
              </div>
              <p className={styles.progressText}>{model.progressLabel}</p>
            </div>
          </section>

          <section className={styles.card}>
            <h3 className={styles.subTitle}>Current Stage</h3>
            <p className={styles.stageName}>
              <span className={styles.iconToken} aria-hidden="true">
                <BriefcaseBusiness size={16} />
              </span>
              {model.currentStage}
            </p>
            <p className={styles.stageStep}>{model.currentStageStep}</p>
          </section>

          <section className={styles.card}>
            <h3 className={styles.subTitle}>Tentative Start Date</h3>
            <p className={styles.dateValue}>
              <span className={styles.iconToken} aria-hidden="true">
                <CalendarDays size={16} />
              </span>
              {model.tentativeStartDate}
            </p>
            <p className={styles.dateHint}>{model.daysUntilStart}</p>
          </section>

          <section className={styles.card}>
            <h3 className={styles.subTitle}>Missing Items</h3>
            <p className={styles.missingCount}>
              <span className={styles.iconToken} aria-hidden="true">
                <FileWarning size={16} />
              </span>
              {model.missingItemsCount}
            </p>
            <p className={styles.dateHint}>Require your action</p>
          </section>

          <section className={styles.card}>
            <h3 className={styles.subTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              {model.quickLinks.map((link) => {
                const LinkIcon = quickLinkIconMap[link as keyof typeof quickLinkIconMap]

                return (
                  <li key={link}>
                    <button type="button" className={styles.linkButton}>
                      <span className={styles.linkLabelWrap}>
                        <span className={styles.inlineIcon} aria-hidden="true">
                          {LinkIcon ? <LinkIcon size={16} /> : <CircleHelp size={16} />}
                        </span>
                        {link}
                      </span>
                      <ChevronRight size={14} aria-hidden="true" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className={styles.card}>
            <div className={styles.questionsCard}>
              <span className={styles.questionsIcon} aria-hidden="true">
                <MessagesSquare size={16} />
              </span>
              <div>
                <h3 className={styles.questionsTitle}>Questions?</h3>
                <p className={styles.questionsText}>
                  Ask our AI assistant or reach out to your HR partner anytime.
                </p>
              </div>
            </div>
          </section>
        </aside>

        <section className={styles.mainColumn} aria-label="Customer onboarding workspace">
          <header className={styles.headerCard}>
            <div>
              <h1 className={styles.pageTitle}>{model.heading}</h1>
              <p className={styles.welcome}>{model.welcome}</p>
            </div>
            <div className={styles.headerMeta}>
              <p>Last updated: {model.lastUpdated}</p>
              <button type="button" className={styles.refreshButton}>
                <RefreshCw size={14} aria-hidden="true" />
                Refresh
              </button>
            </div>
          </header>

          <section className={styles.chatCard} aria-label="AI onboarding assistant">
            <div className={styles.chatHeader}>
              <div>
                <h2 className={styles.chatTitle}>
                  <Sparkles size={18} aria-hidden="true" />
                  AI Onboarding Assistant
                </h2>
                <p className={styles.chatSubtitle}>
                  Ask anything about your onboarding, required tasks, documents, or next steps.
                </p>
              </div>
              <button type="button" className={styles.clearButton} onClick={() => setMessages([])}>
                Clear chat
              </button>
            </div>

            <div className={styles.chatThread}>
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`${styles.chatMessage} ${
                    message.author === 'assistant' ? styles.assistantMessage : styles.userMessage
                  }`}
                >
                  {message.author === 'assistant' ? (
                    <span className={styles.messageAvatar} aria-hidden="true">
                      <Sparkles size={14} />
                    </span>
                  ) : null}
                  <p>{message.text}</p>
                  <span className={styles.messageTime}>{message.timeLabel}</span>
                </article>
              ))}
            </div>

            <div className={styles.chatComposer}>
              <button type="button" className={styles.attachButton} aria-label="Attach file">
                <Paperclip size={16} aria-hidden="true" />
              </button>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className={styles.chatInput}
                placeholder="Type your question here..."
                aria-label="Message the onboarding assistant"
              />
              <button
                type="button"
                className={styles.sendButton}
                disabled={!canSend}
                onClick={handleSend}
                aria-label="Send message"
              >
                <Send size={16} aria-hidden="true" />
              </button>
            </div>
            <p className={styles.chatFootnote}>AI can make mistakes. Verify important information.</p>
          </section>
        </section>

        <aside className={styles.rightRail} aria-label="Checklist and support">
          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.railTitle}>My Checklist</h2>
              <button type="button" className={styles.inlineLink}>View all</button>
            </div>
            <ul className={styles.checklist}>
              {model.checklist.map((item) => (
                <li key={item.id} className={styles.checklistItem}>
                  <span className={styles.itemLeft}>
                    <span className={styles.inlineIcon} aria-hidden="true">
                      {item.status === 'missing' ? (
                        <Circle size={16} />
                      ) : item.status === 'completed' ? (
                        <CircleCheck size={16} />
                      ) : (
                        <Clock3 size={16} />
                      )}
                    </span>
                    {item.label}
                  </span>
                  <span className={styles.itemRight}>
                    <span className={styles.statusBadge} data-status={item.status}>
                      {checklistStatusLabel[item.status]}
                    </span>
                    <ChevronRight size={14} aria-hidden="true" />
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.card}>
            <h2 className={styles.railTitle}>Need Help?</h2>
            <div className={styles.supportIdentity}>
              {model.supportContact.avatarPath && supportAvatarAvailable ? (
                <img
                  src={model.supportContact.avatarPath}
                  alt={model.supportContact.avatarAlt ?? `Portrait of ${model.supportContact.name}`}
                  className={styles.contactAvatar}
                  onError={() => setSupportAvatarAvailable(false)}
                />
              ) : (
                <span className={styles.avatarFallback} aria-hidden="true">
                  {supportInitials}
                </span>
              )}
              <div>
                <p className={styles.contactName}>{model.supportContact.name}</p>
                <p className={styles.contactRole}>{model.supportContact.role}</p>
              </div>
            </div>
            <p className={styles.contactLink}>
              <Mail size={14} aria-hidden="true" />
              {model.supportContact.email}
            </p>
            <p className={styles.contactLink}>
              <MessagesSquare size={14} aria-hidden="true" />
              {model.supportContact.teamsLabel}
            </p>
            <p className={styles.dateHint}>
              <Clock3 size={14} aria-hidden="true" />
              {model.supportContact.availability}
            </p>
            <div className={styles.supportActions}>
              <button type="button" className={styles.primaryAction}>
                <CircleHelp size={14} aria-hidden="true" />
                Request Help
              </button>
              <button type="button" className={styles.secondaryAction}>
                <MessagesSquare size={14} aria-hidden="true" />
                Message HR
              </button>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.railTitle}>Upcoming Tasks</h2>
              <button type="button" className={styles.inlineLink}>View calendar</button>
            </div>
            <ul className={styles.taskList}>
              {model.upcomingTasks.map((task) => (
                <li key={task.id} className={styles.taskItem}>
                  <div className={styles.itemLeft}>
                    <span className={styles.inlineIcon} aria-hidden="true">
                      <CalendarDays size={16} />
                    </span>
                    <div>
                      <p className={styles.taskTitle}>{task.title}</p>
                      <p className={styles.taskDue}>{task.dueLabel}</p>
                    </div>
                  </div>
                  <span className={styles.itemRight}>
                    {task.status === 'overdue' ? (
                      <AlertCircle size={14} aria-hidden="true" />
                    ) : task.status === 'due-soon' ? (
                      <Clock3 size={14} aria-hidden="true" />
                    ) : (
                      <CircleCheck size={14} aria-hidden="true" />
                    )}
                    <span className={styles.statusBadge} data-status={task.status}>
                      {taskStatusLabel[task.status]}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </main>
  )
}
