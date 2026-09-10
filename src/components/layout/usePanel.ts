import { useEffect, useRef } from 'react'

/**
 * Focus moves into the panel when a project opens and Escape closes it
 * (spec §29). The panel is non-modal: the city stays usable behind it.
 */
export function usePanel<T extends HTMLElement>(key: string | null, onClose: () => void) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!key) return
    ref.current?.focus()
  }, [key])

  useEffect(() => {
    if (!key) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [key, onClose])

  return ref
}
