import styles from './Section.module.css'

export default function Section({ title, description, children }) {
  return (
    <section className={styles.section}>
      {title && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      )}
      {children}
    </section>
  )
}
