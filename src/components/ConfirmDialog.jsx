import './ConfirmDialog.css';
import { useEffect, useId, useRef } from 'react'
import Button from './Button.jsx'
import ErrorMessage from './ErrorMessage.jsx'

function ConfirmDialog({
  open,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onCancel,
  onConfirm,
  loading = false,
  error = '',
  intent = 'danger',
  secondaryAction,
}) {
  const titleId = useId()
  const messageId = useId()
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    previousFocusRef.current = document.activeElement

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus?.()
    }
  }, [onCancel, open])

  if (!open) {
    return null
  }

  return (
    <div className="dialog-backdrop" role="presentation">
      <div
        aria-describedby={messageId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="dialog"
        role="dialog"
      >
        <h2 className="dialog__title" id={titleId}>
          {title}
        </h2>
        <p className="dialog__message" id={messageId}>
          {message}
        </p>
        <ErrorMessage message={error} />
        <div className="dialog__actions">
          {secondaryAction ? (
            <Button onClick={secondaryAction.onClick} variant="secondary">
              {secondaryAction.label}
            </Button>
          ) : null}
          <Button autoFocus onClick={onCancel} variant="secondary">
            {cancelText}
          </Button>
          <Button disabled={loading} onClick={onConfirm} variant={intent}>
            {loading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
