import { usePortfolio } from '@/app/providers/portfolio'
import { Notice } from '@/design-system'

/** Spec §25: confidentiality is stated in the panel, never implied. */
export function ConfidentialProjectNotice() {
  const { t } = usePortfolio()
  return <Notice>{t.confidential.notice}</Notice>
}
