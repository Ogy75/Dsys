import PageHeader from '../components/PageHeader'
import styles from './Placeholder.module.css'
import { Icon } from '../components/Icon'

export default function Placeholder({ title, description }) {
  return (
    <div>
      <PageHeader title={title} description={description || `Documentation and demos for the ${title} component.`} />
      <div className={styles.comingSoon}>
        <div className={styles.icon}>
          <Icon name="inventory_2" size={32} />
        </div>
        <p className={styles.label}>Coming soon</p>
        <p className={styles.sub}>This page is a placeholder. Add your component demo and usage docs here.</p>
      </div>
    </div>
  )
}
