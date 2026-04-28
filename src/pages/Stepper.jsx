import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { DemoCanvas, CodeBlock, UsageSection, PropsTable } from '../components/Demo'
import { Stepper } from '../components/Stepper'
import { Button } from './Button'

const STEPS = [
  { label: 'Personal info', description: 'Name, email and phone number' },
  { label: 'Address', description: 'Shipping destination details' },
  { label: 'Payment', description: 'Card or bank transfer' },
  { label: 'Review', description: 'Confirm your order before placing' },
]

const STEPS_NO_DESC = STEPS.map(s => ({ label: s.label }))

function Controls({ active, setActive, total }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
      <Button
        variant="secondary"
        size="sm"
        disabled={active === 0}
        onClick={() => setActive(a => Math.max(0, a - 1))}
      >
        Back
      </Button>
      <Button
        variant="primary"
        size="sm"
        disabled={active === total}
        onClick={() => setActive(a => Math.min(total, a + 1))}
      >
        {active === total ? 'Done' : 'Next'}
      </Button>
    </div>
  )
}

function InteractiveDemo({ orientation, showDescription, steps: stepsOverride, activeStep: activeOverride }) {
  const steps = stepsOverride ?? (showDescription ? STEPS : STEPS_NO_DESC)
  const [active, setActive] = useState(activeOverride ?? 1)
  return (
    <div style={{ width: '100%' }}>
      <Stepper
        steps={steps}
        activeStep={active}
        orientation={orientation}
        showDescription={showDescription}
        onStepClick={setActive}
      />
      <Controls active={active} setActive={setActive} total={steps.length} />
    </div>
  )
}

const horizontalCode = `<Stepper
  steps={[
    { label: 'Personal info', description: 'Name, email and phone number' },
    { label: 'Address', description: 'Shipping destination details' },
    { label: 'Payment', description: 'Card or bank transfer' },
    { label: 'Review', description: 'Confirm your order before placing' },
  ]}
  activeStep={1}
  onStepClick={(index) => setActiveStep(index)}
/>`

const horizontalNoDescCode = `<Stepper
  steps={[
    { label: 'Personal info' },
    { label: 'Address' },
    { label: 'Payment' },
    { label: 'Review' },
  ]}
  activeStep={1}
  showDescription={false}
/>`

const verticalCode = `<Stepper
  steps={steps}
  activeStep={1}
  orientation="vertical"
/>`

const errorWarningCode = `<Stepper
  steps={[
    { label: 'Personal info', description: 'Completed successfully' },
    { label: 'Address', description: 'Invalid postcode', status: 'error' },
    { label: 'Payment', description: 'Missing card CVV', status: 'warning' },
    { label: 'Review', description: 'Confirm your order' },
  ]}
  activeStep={1}
/>`

const clickableCode = `const [activeStep, setActiveStep] = useState(2)

<Stepper
  steps={steps}
  activeStep={activeStep}
  onStepClick={(index) => setActiveStep(index)}
/>`

const usageCode = `import { Stepper } from '@/components/Stepper'

const [active, setActive] = useState(0)

<Stepper
  steps={[
    { label: 'Personal info', description: 'Name, email and phone number' },
    { label: 'Address', description: 'Shipping destination details', status: 'error' },
    { label: 'Payment', description: 'Card or bank transfer' },
  ]}
  activeStep={active}
  orientation="horizontal"
  showDescription={true}
  onStepClick={setActive}
/>`

const propsData = [
  {
    name: 'steps',
    type: 'Array<{ label: string, description?: string, status?: "error" | "warning" }>',
    default: '—',
    description: 'Ordered step definitions. Minimum 2, maximum 6 — extra steps are silently dropped. status overrides the circle appearance with an error or warning icon and colour.',
  },
  {
    name: 'activeStep',
    type: 'number',
    default: '0',
    description: '0-based index of the current step. All steps before this index are rendered as completed.',
  },
  {
    name: 'orientation',
    type: "'horizontal' | 'vertical'",
    default: "'horizontal'",
    description: 'Layout direction.',
  },
  {
    name: 'showDescription',
    type: 'boolean',
    default: 'true',
    description: 'Render step label and description text. When false only circles and connectors are shown.',
  },
  {
    name: 'onStepClick',
    type: '(index: number) => void',
    default: '—',
    description: 'Called when a completed or errored step circle is clicked. Enables back-navigation. When omitted, circles are not interactive.',
  },
]

export default function StepperPage() {
  return (
    <div>
      <PageHeader
        title="Stepper"
        description="Shows progress through a linear sequence of steps. Supports horizontal and vertical orientations, error/warning states, and clickable back-navigation."
      />

      <Section
        title="Horizontal with description"
        description="Default variant. Labels and descriptions sit below each circle. Upcoming labels dim to grey-300. Click a completed circle to go back."
      >
        <DemoCanvas>
          <InteractiveDemo orientation="horizontal" showDescription={true} />
        </DemoCanvas>
        <CodeBlock code={horizontalCode} language="jsx" />
      </Section>

      <Section
        title="Horizontal without description"
        description="Only circles and connector lines — no label text."
      >
        <DemoCanvas>
          <InteractiveDemo orientation="horizontal" showDescription={false} />
        </DemoCanvas>
        <CodeBlock code={horizontalNoDescCode} language="jsx" />
      </Section>

      <Section
        title="Vertical with description"
        description="Steps stack vertically. Label sits beside the circle. Upcoming labels stay full-colour in vertical layout."
      >
        <DemoCanvas style={{ alignItems: 'flex-start' }}>
          <InteractiveDemo orientation="vertical" showDescription={true} />
        </DemoCanvas>
        <CodeBlock code={verticalCode} language="jsx" />
      </Section>

      <Section
        title="Vertical without description"
        description="Minimal vertical layout — circles and connector only."
      >
        <DemoCanvas style={{ alignItems: 'flex-start' }}>
          <InteractiveDemo orientation="vertical" showDescription={false} />
        </DemoCanvas>
        <CodeBlock code={`<Stepper steps={steps} activeStep={1} orientation="vertical" showDescription={false} />`} language="jsx" />
      </Section>

      <Section
        title="Error and warning states"
        description="Set status='error' or status='warning' on a step to override its circle with a red × or amber !. The step label changes colour to match."
      >
        <DemoCanvas>
          <div style={{ width: '100%' }}>
            <Stepper
              steps={[
                { label: 'Personal info', description: 'Completed successfully' },
                { label: 'Address', description: 'Invalid postcode entered', status: 'error' },
                { label: 'Payment', description: 'Missing card CVV', status: 'warning' },
                { label: 'Review', description: 'Confirm your order before placing' },
              ]}
              activeStep={1}
              showDescription={true}
            />
          </div>
        </DemoCanvas>
        <CodeBlock code={errorWarningCode} language="jsx" />
      </Section>

      <Section
        title="Clickable back-navigation"
        description="Pass onStepClick to make completed step circles interactive. Hover shows opacity feedback. Steps not yet reached remain non-interactive."
      >
        <DemoCanvas>
          <InteractiveDemo
            orientation="horizontal"
            showDescription={true}
            activeStep={2}
            steps={[
              { label: 'Personal info', description: 'John Doe, john@example.com' },
              { label: 'Address', description: '123 Main St, Springfield' },
              { label: 'Payment', description: 'Card or bank transfer' },
              { label: 'Review', description: 'Confirm your order before placing' },
            ]}
          />
        </DemoCanvas>
        <CodeBlock code={clickableCode} language="jsx" />
      </Section>

      <UsageSection title="Usage">
        <CodeBlock code={usageCode} language="jsx" />
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '24px 0 16px' }}>Props</h3>
        <PropsTable props={propsData} />
      </UsageSection>
    </div>
  )
}
