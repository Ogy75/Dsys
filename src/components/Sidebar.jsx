import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { navSections } from '../nav'
import { Icon } from './Icon'
import { ThemeToggle } from './ThemeToggle'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  const [query, setQuery] = useState('')
  const filtered = query.trim()
    ? navSections
        .map(section => ({
          ...section,
          items: section.items.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase())
          ),
        }))
        .filter(section => section.items.length > 0)
    : navSections

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandDot} />
        <span className={styles.brandName}>Design System</span>
      </div>

      <ThemeToggle />

      <div className={styles.search}>
        <span className={styles.searchIcon}>
          <Icon name="search" size={16} />
        </span>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Find component…"
          aria-label="Search components"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && (
          <button className={styles.searchClear} onClick={() => setQuery('')} aria-label="Clear search">
            <Icon name="close" size={14} />
          </button>
        )}
      </div>

      <nav className={styles.nav}>
        {filtered.map((section) => (
          <div key={section.label} className={styles.section}>
            <span className={styles.sectionLabel}>{section.label}</span>
            <ul className={styles.list}>
              {section.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `${styles.link} ${isActive ? styles.linkActive : ''}`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className={styles.noResults}>No results for "{query}"</p>
        )}
      </nav>
    </aside>
  )
}
