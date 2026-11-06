import { type ComponentProps, useId } from 'react';
import { cx } from '../../utils/cx';
import { formatBytes, useFileUpload } from '../../utils/useFileUpload';
import { Button, buttonClassName } from '../Button';
import { Progress } from '../Progress';

export interface FileUploadAttachment {
  id: string;
  name: string;
  size?: number;
  onRemove: () => void;
  onDownload?: () => void;
}

export interface FileUploadProps
  extends Omit<
    ComponentProps<'input'>,
    'type' | 'value' | 'defaultValue' | 'children' | 'required'
  > {
  upload: (
    file: File,
    options: { signal: AbortSignal; onProgress: (percent: number) => void },
  ) => Promise<void>;
  onUploaded?: (file: File) => void;
  onRemove?: (file: File) => void;
  onDiscard?: (file: File) => void;
  attachedFiles?: readonly FileUploadAttachment[];
  downloadLabel?: string;
  label?: string;
  uploadingLabel?: string;
  uploadedLabel?: string;
  errorLabel?: string;
  errorMessage?: string;
  retryLabel?: string;
  removeLabel?: string;
  cancelLabel?: string;
  formatSize?: (bytes: number) => string;
  formatDownloadLabel?: (name: string) => string;
  formatRemoveLabel?: (name: string) => string;
  formatUploadedMessage?: (name: string) => string;
  formatErrorMessage?: (name: string) => string;
}

export function FileUpload({
  upload,
  onUploaded,
  onRemove,
  onDiscard,
  attachedFiles,
  downloadLabel = 'Download',
  label = 'Choose files',
  uploadingLabel = 'Uploading',
  uploadedLabel = 'Uploaded',
  errorLabel = 'Error',
  errorMessage,
  retryLabel = 'Retry',
  removeLabel = 'Remove',
  cancelLabel = 'Cancel',
  formatSize = formatBytes,
  formatDownloadLabel,
  formatRemoveLabel,
  formatUploadedMessage,
  formatErrorMessage,
  id,
  ref,
  multiple,
  disabled,
  onChange,
  className,
  style,
  ...props
}: FileUploadProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const { entries, announcements, inputProps, actionRef, retryOrRemove, remove, removeAttachment } =
    useFileUpload({
      upload,
      onUploaded,
      onRemove,
      onDiscard,
      attachedFiles,
      errorMessage,
      formatUploadedMessage,
      formatErrorMessage,
      multiple,
      disabled,
      onChange,
      ref,
    });

  return (
    <div className={cx('motiv-file-upload', className)} style={style}>
      <input
        {...props}
        {...inputProps}
        id={inputId}
        className="motiv-file-upload__input motiv-visually-hidden"
      />
      <label
        htmlFor={inputId}
        className={buttonClassName({ variant: 'outline', className: 'motiv-file-upload__picker' })}
        aria-disabled={disabled || undefined}
      >
        {label}
      </label>
      {(entries.length > 0 || (attachedFiles?.length ?? 0) > 0) && (
        <ul className="motiv-file-upload__list">
          {attachedFiles?.map((file) => (
            <li key={file.id} className="motiv-file-upload__row" aria-label={file.name}>
              <span>{file.name}</span>
              {file.size !== undefined && (
                <div className="motiv-file-upload__details">{formatSize(file.size)}</div>
              )}
              <div className="motiv-file-upload__actions">
                {file.onDownload && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={disabled}
                    aria-label={formatDownloadLabel?.(file.name) ?? `${downloadLabel} ${file.name}`}
                    onClick={file.onDownload}
                  >
                    {downloadLabel}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={disabled}
                  aria-label={formatRemoveLabel?.(file.name) ?? `${removeLabel} ${file.name}`}
                  onClick={() => removeAttachment(file.onRemove)}
                >
                  {removeLabel}
                </Button>
              </div>
            </li>
          ))}
          {entries.map((entry) => {
            const actionLabel =
              entry.status === 'uploading'
                ? cancelLabel
                : entry.status === 'error'
                  ? retryLabel
                  : removeLabel;
            const errorId = `${generatedId}-${entry.id}-error`;
            return (
              <li
                key={entry.id}
                className="motiv-file-upload__row"
                aria-label={entry.file.name}
                aria-describedby={entry.status === 'error' ? errorId : undefined}
              >
                <Progress
                  className="motiv-file-upload__progress"
                  label={entry.file.name}
                  value={entry.progress}
                  showValue={false}
                />
                <div className="motiv-file-upload__details">
                  <span>{formatSize(entry.file.size)}</span>
                  <span>
                    {entry.status === 'uploading'
                      ? uploadingLabel
                      : entry.status === 'done'
                        ? uploadedLabel
                        : errorLabel}
                  </span>
                </div>
                {entry.status === 'error' && (
                  <p id={errorId} className="motiv-file-upload__error">
                    {entry.error}
                  </p>
                )}
                <div className="motiv-file-upload__actions">
                  <Button
                    ref={actionRef(entry.id)}
                    variant="ghost"
                    size="sm"
                    disabled={disabled}
                    aria-label={`${actionLabel}: ${entry.file.name}`}
                    onClick={() => retryOrRemove(entry)}
                  >
                    {actionLabel}
                  </Button>
                  {entry.status === 'error' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={disabled}
                      aria-label={`${removeLabel}: ${entry.file.name}`}
                      onClick={() => remove(entry.id)}
                    >
                      {removeLabel}
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="motiv-visually-hidden" aria-live="polite" aria-relevant="additions">
        {announcements.map((message) => (
          <div key={message.id}>{message.text}</div>
        ))}
      </div>
    </div>
  );
}
