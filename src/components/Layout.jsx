import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import styles from './Layout.module.css'

const FULL_BLEED_ROUTES = ['/examples/demo']

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const fullBleed = FULL_BLEED_ROUTES.includes(pathname)

  return (
    <div className={styles.root}>
      <Sidebar />
      <main className={styles.main}>
        {fullBleed ? children : <div className={styles.content}>{children}</div>}
      </main>
    </div>
  )
}
