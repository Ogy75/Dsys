import styles from './Demo.module.css'

export function DemoCanvas({ children, style }) {
  return (
    <div className={styles.canvas} style={style}>
      {children}
    </div>
  )
}

export function CodeBlock({ code, language = 'jsx' }) {
  return (
    <div className={styles.codeWrapper}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLanguage}>{language}</span>
      </div>
      <pre className={styles.pre}>
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function UsageSection({ title = 'Usage', children }) {
  return (
    <div className={styles.usageSection}>
      <h3 className={styles.usageTitle}>{title}</h3>
      {children}
    </div>
  )
}

export function PropsTable({ props }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td><code className={styles.code}>{prop.name}</code></td>
              <td><code className={styles.code}>{prop.type}</code></td>
              <td><code className={styles.code}>{prop.default ?? '—'}</code></td>
              <td>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
