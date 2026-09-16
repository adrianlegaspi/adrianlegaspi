import { Check, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePortfolio } from '@/app/providers/portfolio'
import { Button, cx, icon, surface } from '@/design-system'
import { copyText } from './copyText'

export function EmailCopyButton({ email, label }: { email: string; label: string }) {
  const { t } = usePortfolio()
  const [copyCount, setCopyCount] = useState(0)
  const copied = copyCount > 0

  useEffect(() => {
    if (!copied) return
    const timeout = window.setTimeout(() => setCopyCount(0), 1800)
    return () => window.clearTimeout(timeout)
  }, [copied, copyCount])

  return (
    <>
      <Button
        variant="outline"
        className="gap-1.5"
        aria-label={t.contact.copyEmail}
        onClick={() => {
          void copyText(email).then((success) => {
            if (success) setCopyCount((count) => count + 1)
          })
        }}
      >
        <Mail {...icon} />
        {label}
      </Button>
      {copied &&
        createPortal(
          <div
            role="status"
            className="pointer-events-none fixed inset-x-4 top-20 z-50 flex justify-center"
          >
            <div
              className={cx(
                surface.pill,
                'flex items-center gap-2 border border-line px-4 py-3',
                'text-sm font-medium text-ink',
              )}
            >
              <Check {...icon} className="text-accent" />
              {t.contact.emailCopied}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
