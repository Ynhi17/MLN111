import { useEffect, useRef, type ReactNode } from 'react'

export default function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    dialog.current?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.current?.close()
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [open])
  return <dialog ref={dialog} aria-label="Góc suy ngẫm" className="modal-content fixed m-auto w-[calc(100%-32px)] max-w-lg max-h-[90dvh] overflow-y-auto rounded-3xl border-0 bg-white p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    onCancel={(event) => { event.preventDefault(); close.current() }}
    onClick={(event) => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close.current() } }}>
    {open && <><button aria-label="Đóng hộp thoại" onClick={onClose} className="absolute top-3 right-3 size-10 rounded-full bg-muted">✕</button>{children}</>}
  </dialog>
}
