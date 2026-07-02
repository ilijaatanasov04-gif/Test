import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Icon } from './Icons'

let scrollLocks = 0

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    scrollLocks += 1
    document.body.classList.add('no-scroll')
    return () => {
      scrollLocks -= 1
      if (scrollLocks <= 0) document.body.classList.remove('no-scroll')
    }
  }, [active])
}

type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string | null
  className?: string
  children: ReactNode
}

export function Modal({ open, onClose, title, subtitle = null, className = '', children }: ModalProps) {
  useBodyScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <section
        className={`modal ${className || ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h3>{title}</h3>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
            {Icon.close}
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}

type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({ open, title, message, confirmLabel, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title} className="confirm-modal">
      <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.5 }}>{message}</p>
      <div className="modal-actions">
        <button type="button" className="ghost-btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="danger-btn" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
