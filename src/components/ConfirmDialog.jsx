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
  if (!open) {
    return null
  }

  return (
    <div className="dialog-backdrop" role="presentation">
      <div aria-modal="true" className="dialog" role="dialog">
        <h2 className="dialog__title">{title}</h2>
        <p className="dialog__message">{message}</p>
        <ErrorMessage message={error} />
        <div className="dialog__actions">
          {secondaryAction ? (
            <Button onClick={secondaryAction.onClick} variant="secondary">
              {secondaryAction.label}
            </Button>
          ) : null}
          <Button onClick={onCancel} variant="secondary">
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
