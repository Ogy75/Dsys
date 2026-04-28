import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Pagination } from '../components/Pagination'

const basicCode = `<Pagination page={page} total={20} onChange={setPage} />`

const paginationProps = [
  { name: 'page',     type: 'number',                   default: '1',    description: 'Current page (1-indexed).' },
  { name: 'total',    type: 'number',                   default: '1',    description: 'Total number of pages.' },
  { name: 'onChange', type: '(page: number) => void',   default: '—',    description: 'Called with the new page on navigation.' },
  { name: 'size',     type: "'lg' | 'md'",              default: "'lg'", description: "lg = 40×40px buttons (default). md = compact variant for dense surfaces." },
]

export default function PaginationPage() {
  const [page1, setPage1] = useState(1)
  const [page2, setPage2] = useState(1)
  const [page3, setPage3] = useState(1)
  const [page4, setPage4] = useState(1)

  /* Demo-only rows-per-page state */
  const [pageSize, setPageSize] = useState(10)
  const [rppPage, setRppPage] = useState(1)
  const TOTAL_ITEMS = 143
  const rppTotal = Math.ceil(TOTAL_ITEMS / pageSize)

  return (
    <div>
      <PageHeader
        title="Pagination"
        description="Page navigation control. Shows first/last page anchors and a sliding window around the current page."
      />

      <Section title="Basic" description={`Page ${page1} of 20`}>
        <DemoCanvas>
          <Pagination page={page1} total={20} onChange={setPage1} />
        </DemoCanvas>
        <CodeBlock code={basicCode} language="jsx" />
      </Section>

      <Section
        title="With rows-per-page selector"
        description="The selector lives outside the component — compose it yourself to match your layout needs."
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-small-size)', color: 'var(--color-grey-500)', marginBottom: 8 }}>
          Rows per page
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setRppPage(1) }}
            style={{ height: 32, padding: '0 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-small-size)', color: 'var(--color-text-primary)', cursor: 'pointer', outline: 'none', background: 'var(--color-bg-surface)' }}
          >
            {[10, 25, 50, 100].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </label>
        <DemoCanvas>
          <Pagination page={rppPage} total={rppTotal} onChange={setRppPage} />
        </DemoCanvas>
        <CodeBlock code={`const [pageSize, setPageSize] = useState(10)
const [page, setPage] = useState(1)
const total = Math.ceil(totalItems / pageSize)

<label>
  Rows per page
  <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}>
    {[10, 25, 50, 100].map(o => <option key={o} value={o}>{o}</option>)}
  </select>
</label>
<Pagination page={page} total={total} onChange={setPage} />`} language="jsx" />
      </Section>

      <Section title="Few pages" description="Ellipsis suppressed when a single page would be hidden — it's shown directly instead.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <Pagination page={page2} total={7} onChange={setPage2} />
          <Pagination page={page3} total={8} onChange={setPage3} />
        </DemoCanvas>
      </Section>

      <Section title="MD size" description="Compact variant for use inside dense UI surfaces like table footers.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <Pagination page={page2} total={20} onChange={setPage2} size="md" />
          <Pagination page={page4} total={7}  onChange={setPage4} size="md" />
        </DemoCanvas>
        <CodeBlock code={`<Pagination page={page} total={20} onChange={setPage} size="md" />`} language="jsx" />
      </Section>

      <UsageSection title="Usage">
        <PropsTable props={paginationProps} />
      </UsageSection>
    </div>
  )
}
