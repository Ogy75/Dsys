import styles from './Stepper.module.css'
import { Icon } from './Icon'

function CheckIcon() {
  return <Icon name="check" size={16} />
}

function ErrorIcon() {
  return <Icon name="close" size={16} />
}

function WarningIcon() {
  return <Icon name="priority_high" size={16} />
}

function StepCircle({ index, stepState, stepStatus }) {
  let icon
  if (stepStatus === 'error') icon = <ErrorIcon />
  else if (stepStatus === 'warning') icon = <WarningIcon />
  else if (stepState === 'completed') icon = <CheckIcon />
  else icon = <span className={styles.circleNumber}>{index + 1}</span>

  const cls = [
    styles.circle,
    styles[stepState],
    stepStatus === 'error' ? styles.circleError : '',
    stepStatus === 'warning' ? styles.circleWarning : '',
  ].filter(Boolean).join(' ')

  return <div className={cls}>{icon}</div>
}

export function Stepper({
  steps,
  activeStep = 0,
  orientation = 'horizontal',
  showDescription = true,
  onStepClick,
}) {
  const isVertical = orientation === 'vertical'
  const clampedSteps = steps.slice(0, 6)

  if (clampedSteps.length < 2) {
    console.warn('Stepper requires at least 2 steps.')
    return null
  }

  return (
    <ol
      className={[styles.stepper, isVertical ? styles.vertical : styles.horizontal].join(' ')}
      aria-label="Steps"
    >
      {clampedSteps.map((step, i) => {
        const stepStatus = step.status // 'error' | 'warning' | undefined
        const isCompleted = i < activeStep
        const isActive = i === activeStep
        const isLast = i === clampedSteps.length - 1

        // Error/warning override completed appearance but not the index logic
        const stepState = isCompleted ? 'completed' : isActive ? 'active' : 'upcoming'

        // A step is clickable if a handler is provided and it's completed, error, or warning
        const isClickable = !!onStepClick && (isCompleted || !!stepStatus) && !isActive
        const dimLabel = !isVertical && stepState === 'upcoming' && !stepStatus

        const nameClass = [
          styles.stepName,
          dimLabel ? styles.dimmed : '',
          stepStatus === 'error' ? styles.nameError : '',
          stepStatus === 'warning' ? styles.nameWarning : '',
        ].filter(Boolean).join(' ')

        const descClass = [
          styles.stepDesc,
          dimLabel ? styles.dimmed : '',
        ].filter(Boolean).join(' ')

        const textBlock = showDescription && (
          <div className={[styles.textBlock, isVertical ? styles.textBlockVertical : ''].filter(Boolean).join(' ')}>
            <span className={nameClass}>{step.label}</span>
            {step.description && (
              <span className={descClass}>{step.description}</span>
            )}
          </div>
        )

        const circle = <StepCircle index={i} stepState={stepState} stepStatus={stepStatus} />

        const circleEl = isClickable ? (
          <button
            type="button"
            className={styles.circleBtn}
            onClick={() => onStepClick(i)}
            aria-label={`Go to step ${i + 1}: ${step.label}`}
          >
            {circle}
          </button>
        ) : circle

        if (isVertical) {
          return (
            <li key={i} className={[
              styles.stepVertical,
              showDescription ? styles.stepVerticalWithText : '',
              isLast ? (showDescription ? styles.stepVerticalLast : styles.stepVerticalLastNoDesc) : '',
            ].filter(Boolean).join(' ')}>
              <div className={styles.iconRowV}>
                {circleEl}
                {textBlock}
              </div>
              {!isLast && (
                <div className={styles.connectorWrapperV}>
                  <div className={styles.connectorV} />
                </div>
              )}
            </li>
          )
        }

        return (
          <li key={i} className={[styles.stepHorizontal, isLast ? (showDescription ? styles.stepLast : styles.stepLastNoDesc) : ''].filter(Boolean).join(' ')}>
            <div className={styles.iconRowH}>
              {circleEl}
              {!isLast && (
                <div className={styles.connectorWrapperH}>
                  <div className={styles.connectorH} />
                </div>
              )}
            </div>
            {textBlock}
          </li>
        )
      })}
    </ol>
  )
}
