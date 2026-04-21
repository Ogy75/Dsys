import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Pagination } from '../components/Pagination'

const basicCode = `<Pagination page={page} total={20} onChange={setPage} />`

const countCode = `<Pagination
  page={page}
  total={20}
  onChange={setPage}
  totalItems={200}
  pageSize={10}
/>`

const fullCode = `<Pagination
  page={page}
  total={Math.ceil(totalItems / pageSize)}
  onChange={setPage}
  totalItems={totalItems}
  pageSize={pageSize}
  pageSizeOptions={[10, 25, 50, 100]}
  onPageSizeChange={size => { setPageSize(size); setPage(1) }}
/>`

const paginationProps = [
  { name: 'page', type: 'number', default: '1', description: 'Current page (1-indexed).' },
  { name: 'total', type: 'number', default: '1', description: 'Total number of pages.' },
  { name: 'onChange', type: '(page: number) => void', default: '—', description: 'Called with the new page on navigation.' },
  { name: 'totalItems', type: 'number', default: '—', description: 'Total item count. Enables the "X–Y of Z" result count display when combined with pageSize.' },
  { name: 'pageSize', type: 'number', default: '—', description: 'Current number of items per page. Required for result count display.' },
  { name: 'pageSizeOptions', type: 'number[]', default: '[10,25,50,100]', description: 'Options for the rows-per-page selector.' },
  { name: 'onPageSizeChange', type: '(size: number) => void', default: '—', description: 'Enables the rows-per-page selector. Reset page to 1 inside this handler.' },
  { name: 'size', type: "'lg' | 'md'", default: "'lg'", description: "lg = 40×40px buttons (default). md = 24×24px compact variant for dense surfaces." },
]

export default function PaginationPage() {
  const [page1, setPage1] = useState(1)
  const [page2, setPage2] = useState(1)
  const [page3, setPage3] = useState(1)
  const [page4, setPage4] = useState(1)
  const [page5, setPage5] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const TOTAL_ITEMS = 143

  return (
    <div>
      <PageHeader
        title="Pagination"
        description="Page navigation control. Shows first/last page anchors and a sliding window around the current page. Ellipsis buttons are clickable — they turn into a jump-to-page input on click."
      />

      <Section title="Basic" description={`Page ${page1} of 20`}>
        <DemoCanvas>
          <Pagination page={page1} total={20} onChange={setPage1} />
        </DemoCanvas>
        <CodeBlock code={basicCode} language="jsx" />
      </Section>

      <Section title="With result count" description={`Page ${page2} of 20 · showing items ${(page2 - 1) * 10 + 1}–${Math.min(page2 * 10, 200)} of 200`}>
        <DemoCanvas>
          <Pagination
            page={page2}
            total={20}
            onChange={setPage2}
            totalItems={200}
            pageSize={10}
          />
        </DemoCanvas>
        <CodeBlock code={countCode} language="jsx" />
      </Section>

      <Section title="With rows-per-page selector" description={`Page ${page3} of ${Math.ceil(TOTAL_ITEMS / pageSize)} · ${TOTAL_ITEMS} items`}>
        <DemoCanvas>
          <Pagination
            page={page3}
            total={Math.ceil(TOTAL_ITEMS / pageSize)}
            onChange={setPage3}
            totalItems={TOTAL_ITEMS}
            pageSize={pageSize}
            pageSizeOptions={[10, 25, 50, 100]}
            onPageSizeChange={size => { setPageSize(size); setPage3(1) }}
          />
        </DemoCanvas>
        <CodeBlock code={fullCode} language="jsx" />
      </Section>

      <Section title="Few pages" description="Ellipsis suppressed when a single page would be hidden — it's shown directly instead.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <Pagination page={page4} total={7} onChange={setPage4} />
          <Pagination page={page5} total={8} onChange={setPage5} />
        </DemoCanvas>
      </Section>

      <Section title="MD size" description="Compact variant for use inside dense UI surfaces like table footers.">
        <DemoCanvas style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <Pagination page={page4} total={20} onChange={setPage4} size="md" />
          <Pagination page={page5} total={7} onChange={setPage5} size="md" />
        </DemoCanvas>
        <CodeBlock code={`<Pagination page={page} total={20} onChange={setPage} size="md" />`} language="jsx" />
      </Section>

      <UsageSection title="Usage">
        <PropsTable props={paginationProps} />
      </UsageSection>
    </div>
  )
}
