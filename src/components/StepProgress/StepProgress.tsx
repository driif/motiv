import type { ComponentProps, ReactNode } from 'react';
import { cx } from '../../utils/cx';
import { Icon } from '../../utils/Icon';

export interface StepProgressStep {
  id: string;
  label: string;
  /** Shown under the track while this step is active */
  description?: ReactNode;
}

export interface StepProgressProps extends ComponentProps<'div'> {
  steps: StepProgressStep[];
  /** Zero-based index of the active step */
  current: number;
  /** Marks every step done */
  completed?: boolean;
  completedText?: ReactNode;
  label?: string;
  /** Screen-reader suffix on finished steps */
  doneText?: string;
}

export function StepProgress({
  steps,
  current,
  completed = false,
  completedText,
  label = 'Progress',
  doneText = 'done',
  className,
  ...props
}: StepProgressProps) {
  const last = Math.max(steps.length - 1, 1);
  const fill = completed ? 1 : Math.min(Math.max(current, 0), last) / last;
  const hasPanels = completedText != null || steps.some((step) => step.description != null);

  return (
    <div {...props} className={cx('motiv-steps', className)}>
      <div className="motiv-steps__track">
        <span className="motiv-steps__line" aria-hidden="true">
          <span className="motiv-steps__fill" style={{ scale: `${fill} 1` }} />
        </span>
        <ol className="motiv-steps__list" aria-label={label}>
          {steps.map((step, i) => {
            const done = completed || i < current;
            const active = !completed && i === current;
            return (
              <li
                key={step.id}
                className="motiv-steps__step"
                data-state={done ? 'done' : active ? 'current' : undefined}
                aria-current={active ? 'step' : undefined}
              >
                <span className="motiv-steps__dot" aria-hidden="true">
                  <span className="motiv-steps__num">{i + 1}</span>
                  <Icon className="motiv-steps__check">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </Icon>
                </span>
                <span className="motiv-steps__label">
                  {step.label}
                  {done && <span className="motiv-visually-hidden"> ({doneText})</span>}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {hasPanels && (
        <div className="motiv-steps__panels" aria-live="polite">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className="motiv-steps__panel"
              data-on={(!completed && i === current) || undefined}
            >
              {step.description}
            </div>
          ))}
          {completedText != null && (
            <div className="motiv-steps__panel" data-on={completed || undefined}>
              {completedText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
