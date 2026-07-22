import type { CandidateCase } from '../domain/onboarding'
import { CandidateRow } from './CandidateRow'
import styles from './CandidateSection.module.css'

interface CandidateSectionProps {
  title: string
  description: string
  candidates: CandidateCase[]
}

export function CandidateSection({ title, description, candidates }: CandidateSectionProps) {
  return (
    <section className={styles.section} aria-labelledby={title}>
      <header className={styles.sectionHeader}>
        <div>
          <h2 id={title} className={styles.title}>
            {title}
          </h2>
          <p className={styles.description}>{description}</p>
        </div>
        <span className={styles.countBadge}>{candidates.length} cases</span>
      </header>

      <div className={styles.rows}>
        {candidates.map((candidate) => (
          <CandidateRow key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </section>
  )
}
