import { Volume2, VolumeX } from 'lucide-react'
import { usePortfolio } from '@/app/providers/portfolio'
import { Button, icon } from '@/design-system'

export function SoundToggle() {
  const { soundEnabled, setSoundEnabled, t } = usePortfolio()
  const label = soundEnabled ? t.sound.mute : t.sound.unmute
  const Icon = soundEnabled ? Volume2 : VolumeX

  return (
    <Button
      variant="icon"
      aria-label={label}
      aria-pressed={soundEnabled}
      aria-keyshortcuts="M"
      title={label}
      onClick={() => setSoundEnabled(!soundEnabled)}
    >
      <Icon {...icon} />
    </Button>
  )
}
