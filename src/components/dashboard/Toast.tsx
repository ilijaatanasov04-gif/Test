import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Icon } from './Icons'

export type ToastKind = 'success' | 'error' | 'info'

export type Toast = {
  id: number
  kind: ToastKind
  message: string
}

type ToastContextValue = {
  toasts: Toast[]
  push: (kind: ToastKind, message: string) => void
  dismiss: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextIdRef = useRef(1)
  const timeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const handle = timeoutsRef.current.get(id)
    if (handle) {
      clearTimeout(handle)
      timeoutsRef.current.delete(id)
    }
  }, [])

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = nextIdRef.current
    nextIdRef.current += 1
    setToasts((current) => [...current, { id, kind, message }])
    const handle = setTimeout(() => dismiss(id), kind === 'error' ? 6000 : 3500)
    timeoutsRef.current.set(id, handle)
  }, [dismiss])

  useEffect(() => {
    const timeouts = timeoutsRef.current
    return () => {
      timeouts.forEach((handle) => clearTimeout(handle))
      timeouts.clear()
    }
  }, [])

  const value = useMemo<ToastContextValue>(() => ({ toasts, push, dismiss }), [toasts, push, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used inside a ToastProvider')
  }
  return context
}

function ToastViewport({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  if (!toasts.length) return null

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.kind}`}>
          <span>{toast.message}</span>
          <button type="button" aria-label="Dismiss" onClick={() => onDismiss(toast.id)}>
            {Icon.close}
          </button>
        </div>
      ))}
    </div>
  )
}
